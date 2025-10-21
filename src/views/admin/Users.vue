<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/api/axios";
import { toast } from "vue3-toastify";
import SearchBar from "../../components/SearchBar.vue";
import Loader from "../../components/Loader.vue";

const users = ref([]);
const currentRole = ref("ca"); // default: tampilkan semua
const loading = ref(false);
const showForm = ref(false);
// const isModalOpen = ref(false)
const selectedUser = ref(null)
let cust_reservations = ref(null)
let isSearch = false

//for the pagination
const currentPage = ref(1)
const perPage = ref(5)

const toggleForm = () => {
  showForm.value = !showForm.value;
  if (!showForm.value) {
    // reset form saat disembunyikan
    editingId.value = null;
    form.value = { name: "", email: "", phone: "", role: "cashier" };
    // perPage = ref(3)
  }
};

// Pagination logic
const totalPages = computed(() =>
  Math.ceil(users.value.length / perPage.value)
);

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return users.value.slice(start, end);
});

const handleSearch = async (query) => {
  if (!query.trim()){
    fetchUsers()
    isSearch = false
    return
  }
  try{
    const res = await api.get(`/users/search?query=${query}`)
    // await new Promise((resolve) => setTimeout(resolve, 800)); // simulasi delay 0.8 detik
    users.value = res.data
    isSearch = true
  } catch (err){
    console.error(err);
    // toast.error("An error occurred while saving the user.", err.message)
    // ambil pesan error dari server (kalau ada)
    const message =
      err.response?.data?.message || // pesan dari backend (res.status().json({ message: "..."}))
      err.message || // pesan dari axios sendiri (misal timeout)
      "Terjadi kesalahan saat menyimpan data."; // fallback pesan default

    toast.error(message);
  }
}

// form CRUD
const form = ref({ name: "", email: "", phone: "", role: "cashier" });
const editingId = ref(null);

// fungsi ambil data user
const fetchUsers = async () => {
  loading.value = true;
  let endpoint = "/users/barbers";

  switch (currentRole.value) {
    case "ca":
      endpoint = "/users/ca";
      break;
    case "barber":
      endpoint = "/users/barbers";
      break;
    case "customer":
      endpoint = "/users/customers";
      break;
  }

  try {
    const res = await api.get(endpoint);
    // await new Promise((resolve) => setTimeout(resolve, 800)); // simulasi delay 0.8 detik
    users.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const showDetail = async (id) => {
  const res = await api.get(`/users/${id}`)
  // const res = await api.get(`/users/3`)
  selectedUser.value = res.data
  // isModalOpen.value = true
  cust_reservations = selectedUser.value.customer_reservations
  // console.log(cust_reservations)
}

// CRUD
const saveUser = async () => {
  const cleanForm = {
    ...form.value,
    email:
      form.value.email && form.value.email.trim() !== ""
        ? form.value.email.trim()
        : null,
    phone:
      form.value.phone && form.value.phone.trim() !== ""
        ? form.value.phone.trim()
        : null,
  };
  console.log("Data dikirim:", JSON.stringify(cleanForm, null, 2));
  try {
    if (editingId.value) {
      const res = await api.put(`/users/${editingId.value}`, cleanForm);
      toast.success("Berhasil mengedit pengguna!")
      console.log(res.data);
    } else {
      const res = await api.post("/users", cleanForm);
      toast.success("Berhasil membuat pengguna!")
      console.log(res.data);
    }
    form.value = { name: "", email: "", phone: "", role: "cashier" };
    editingId.value = null;
    fetchUsers();
  } catch (err) {
    console.error(err);
    // toast.error("An error occurred while saving the user.", err.message)
    // ambil pesan error dari server (kalau ada)
    const message =
      err.response?.data?.message || // pesan dari backend (res.status().json({ message: "..."}))
      err.message || // pesan dari axios sendiri (misal timeout)
      "Terjadi kesalahan saat menyimpan data."; // fallback pesan default

    toast.error(message);
  }
};

const editUser = (user) => {
  form.value = { name: user.name, email: user.email, phone: user.phone, role: user.role };
  editingId.value = user.id;
};

const deleteUser = async (id) => {
  if (!confirm("Yakin ingin hapus user ini?")) return;
  try {
    await api.delete(`/users/${id}`);
    fetchUsers();
    toast.success("Berhasil menghapus pengguna!")
  } catch (err) {
    console.error(err);
      const message =
      err.response?.data?.message || // pesan dari backend (res.status().json({ message: "..."}))
      err.message || // pesan dari axios sendiri (misal timeout)
      "Terjadi kesalahan saat menghapus data."; // fallback pesan default

    toast.error(message);
  }
};

// ganti filter
const changeRole = (role) => {
  currentRole.value = role;
  fetchUsers();
};

onMounted(fetchUsers);
</script>

<template>
  <div class="p-4 space-y-6">
    <div class="max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
      <h1 class="text-xl font-semibold dark:text-slate-100 text-slate-950">Kelola Pengguna</h1>
      <!-- Tombol Toggle -->
      <button
        @click="toggleForm"
        class="mt-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
      >
        {{ showForm ? "Sembunyikan Form" : "Tampilkan Form" }}
      </button>
    </div>

    <!-- FORM USER -->
    <form v-if="showForm" @submit.prevent="saveUser" class="text-slate-100 space-y-4 max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
      <!-- <input v-model="form.name" placeholder="Nama" class="w-full p-2 rounded border-b-4 boder-b-slate-100 focus:ring-0 active:border-none" /> -->
      <label for="Name" class="block">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> Nama </span>
        <input
          v-model="form.name"
          type="text"
          id="Name"
          class="mt-0.5 w-full px-2 py-2 lg:py-3 rounded border-gray-300 bg-gray-300 shadow-sm sm:text-sm text-slate-950 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
      </label>
      <div class="flex justify-between items-center gap-4 w-full">

        <label for="Email" class="block w-1/2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> Email </span>
          <input
            v-model="form.email"
            type="email"
            id="Email"
            class="mt-0.5 w-full px-2 py-2 lg:py-3 rounded border-gray-300 bg-gray-300 shadow-sm sm:text-sm text-slate-950 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </label>
        <label for="Phone" class="block w-1/2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> No Telp </span>
          <input
            v-model="form.phone"
            type="text"
            id="Phone"
            class="mt-0.5 w-full px-2 py-2 lg:py-3 rounded border-gray-300 bg-gray-300 shadow-sm sm:text-sm text-slate-950 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </label>
      </div>
      <label for="Role" class="block">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> Role </span>
        <select v-model="form.role" class="w-full border border-gray-200 bg-gray-300 dark:bg-gray-900 shadow p-2 lg:py-3 rounded text-slate-950 dark:text-slate-100" id="Role">
          <option value="admin" class="text-black">Admin</option>
          <option value="cashier" class="text-black">Kasir</option>
          <option value="barber" class="text-black">Barber</option>
        </select>
      </label>
      <!-- <input v-model="form.email" placeholder="Email" class="w-full border p-2 rounded" /> -->
      <button type="submit" class="bg-cyan-600 text-white w-full py-2 rounded hover:cursor-pointer duration-75">
        {{ editingId ? "Update" : "Tambah" }}
      </button>
    </form>

    <!-- FILTER ROLE -->
    <div v-if="!isSearch" class="flex gap-2 flex-wrap max-w-md md:max-w-2xl mx-auto lg:max-w-4xl">
      <button
        v-for="role in [
          { key: 'ca', label: 'Admin & Kasir' },
          { key: 'barber', label: 'Barber' },
          { key: 'customer', label: 'Customer' },
        ]"
        :key="role.key"
        @click="changeRole(role.key)"
        class="px-3 py-2 rounded hover:cursor-pointer duration-75"
        :class="currentRole === role.key ? 'bg-cyan-600 text-slate-100' : 'dark:bg-slate-100 bg-slate-950 text-slate-100 hover:bg-gray-600 dark:hover:bg-gray-100 dark:text-slate-950'"
      >
        {{ role.label }}
      </button>
    </div>

    <!-- TABEL USER -->
    <SearchBar placeholder="Cari nama/emai/no telp pengguna ..." @search="handleSearch" />
    <Loader :visible="loading" />
    <!-- <div v-if="loading" class="dark:text-gray-200 text-gray-700 text-center max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">Memuat data...</div> -->
    <table v-if="!loading" class="dark:bg-slate-600 bg-slate-200 rounded-sm text-[12px] overflow-hidden text-center max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
      <thead class="dark:bg-gray-700 bg-gray-600 text-slate-100 dark:text-slate-100 border-b-2 dark:border-slate-100 border-slate-800">
        <tr>
          <th class="px-2 py-1">No</th>
          <th class="px-2 py-1">Nama</th>
          <th class="px-2 py-1">Email/ No Telp</th>
          <!-- <th class="px-2 py-1">No Telp</th> -->
          <!-- <th class="px-2 py-1">Role</th> -->
          <th class="px-2 py-1">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in paginatedUsers" :key="user.id" class="border-b-2 dark:border-slate-200 border-slate-300">

          <td class="px-2 py-1">{{ (currentPage - 1) * perPage + index + 1 }}</td>
          <td class="px-2 py-1">{{ user.name }}</td>
          <td class="px-2 py-1">{{ user.email ? user.email : user.phone ? user.phone : "-" }}</td>
          <!-- <td class="px-2 py-1">{{ user.phone ? user.phone : "-" }}</td> -->
          <!-- <td class="px-2 py-1 capitalize">{{ user.role }}</td> -->
          <td class="px-2 py-1 text-center space-x-4">
            <button @click="editUser(user)" title="update" class="text-cyan-500 text-2xl hover:cursor-pointer duration-75">
              <i class='bx bxs-pencil' ></i>
            </button>
            <button @click="deleteUser(user.id)" title="delete" class="text-rose-500 text-2xl hover:cursor-pointer duration-75">
              <i class='bx bxs-trash' ></i>
            </button>
            <button @click="showDetail(user.id)" title="detail" class="text-emerald-500 text-2xl hover:cursor-pointer duration-75">
              <i class='bx bx-detail'></i>
            </button>
            
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination -->
    <div class="flex justify-between items-center space-x-2 max-w-md md:max-w-2xl lg:max-w-4xl mx-auto text-slate-950">
      <button
        class="px-3 py-1 bg-gray-200 rounded"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        Prev
      </button>

      <span class="dark:text-slate-100 text-slate-950">Halaman {{ currentPage }} dari {{ totalPages }}</span>

      <button
        class="px-3 py-1 bg-gray-200 rounded"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Next
      </button>
    </div>
    <div v-if="selectedUser" class="flow-root max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
      <dl
        class="-my-3 divide-y divide-gray-200 text-sm *:even:bg-gray-50 dark:divide-gray-700 dark:*:even:bg-gray-800"
      >
        <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt class="font-medium text-gray-900 dark:text-white">Name</dt>
    
          <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{selectedUser.name}}</dd>
        </div>
    
        <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt class="font-medium text-gray-900 dark:text-white">Email</dt>
    
          <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{selectedUser.email ? selectedUser.email : "-"}}</dd>
        </div>
    
        <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt class="font-medium text-gray-900 dark:text-white">No Telp</dt>
    
          <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{selectedUser.phone ? selectedUser.phone : "-"}}</dd>
        </div>
    
        <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt class="font-medium text-gray-900 dark:text-white">Role</dt>
    
          <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{selectedUser.role}}</dd>
        </div>

        <div v-if="cust_reservations.length > 0" class="space-y-4">
          <details v-for="(r, index) in cust_reservations" :key="r.id" 
            class="group border-s-4 border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 [&_summary::-webkit-details-marker]:hidden"
            open
          >
            <summary class="flex items-center justify-between gap-1.5 text-gray-900 dark:text-white">
              <h2 class="font-medium">Reservation {{ index+1 }}</h2>
        
              <svg
                class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
        
            <div class="text-gray-900 dark:text-white pt-3">
              <p class="flex justify-between w-1/3 pt-1"><span class="font-semibold w-1/2">Service Name</span><span class="w-1/2">: {{ r.service.name }}</span></p>
              <p class="flex justify-between w-1/3 pt-1"><span class="font-semibold w-1/2">Status</span> <span class="w-1/2">: {{ r.status }}</span></p>
              <p class="flex justify-between w-1/3 pt-1"><span class="font-semibold w-1/2">Tanggal</span><span class="w-1/2">: {{ r.date }}</span></p>
              <p class="flex justify-between w-1/3 pt-1"><span class="font-semibold w-1/2">Jam</span><span class="w-1/2">: {{ r.time }}</span></p>
            </div>
          </details>
        </div>
        <div v-else class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt class="font-medium text-gray-900 dark:text-white">Reservasi</dt>
    
          <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">Tidak ada data reservasi</dd>
        </div>
      </dl>
    </div>

    <!-- <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-lg relative">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Detail Pengguna
        </h3>

        <div v-if="selectedUser">
          <p><span class="font-semibold">Nama:</span> {{ selectedUser.name }}</p>
          <p><span class="font-semibold">Email:</span> {{ selectedUser.email }}</p>
          <p><span class="font-semibold">Phone:</span> {{ selectedUser.phone }}</p>
          <p><span class="font-semibold">Role:</span> {{ selectedUser.role }}</p>
        </div>

        <button
          @click="isModalOpen = false"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div> -->
  </div>
</template>
