<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/api/axios";
import { toast } from "vue3-toastify";

const users = ref([]);
const currentRole = ref("ca"); // default: tampilkan semua
const loading = ref(false);

//for the pagination
const currentPage = ref(1)
const perPage = ref(5)

// Pagination logic
const totalPages = computed(() =>
  Math.ceil(users.value.length / perPage.value)
);

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return users.value.slice(start, end);
});

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
  }

  try {
    const res = await api.get(endpoint);
    users.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};


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
    <h1 class="text-xl font-semibold text-slate-100">Kelola Pengguna</h1>

    <!-- FORM USER -->
    <form @submit.prevent="saveUser" class="text-slate-100 space-y-4 max-w-md mx-auto md:max-w-2xl">
      <!-- <input v-model="form.name" placeholder="Nama" class="w-full p-2 rounded border-b-4 boder-b-slate-100 focus:ring-0 active:border-none" /> -->
      <label for="Name" class="block">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> Nama </span>
        <input
          v-model="form.name"
          type="text"
          id="Name"
          class="mt-0.5 w-full px-1 py-2 lg:py-3 rounded border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
      </label>
      <label for="Email" class="block">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> Email </span>
        <input
          v-model="form.email"
          type="email"
          id="Email"
          class="mt-0.5 w-full px-1 py-2 lg:py-3 rounded border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
      </label>
      <label for="Phone" class="block">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> No Telp </span>
        <input
          v-model="form.phone"
          type="text"
          id="Phone"
          class="mt-0.5 w-full px-1 py-2 lg:py-3 rounded border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
      </label>
      <label for="Role" class="block">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> Role </span>
        <select v-model="form.role" class="w-full border p-2 lg:py-3 rounded" id="Role">
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
    <div class="flex gap-2 flex-wrap max-w-md md:max-w-2xl mx-auto">
      <button
        v-for="role in [
          { key: 'ca', label: 'Admin & Kasir' },
          { key: 'barber', label: 'Barber' },
        ]"
        :key="role.key"
        @click="changeRole(role.key)"
        class="px-3 py-2 rounded hover:cursor-pointer duration-75"
        :class="currentRole === role.key ? 'bg-cyan-600 text-white' : 'bg-white hover:bg-gray-100'"
      >
        {{ role.label }}
      </button>
    </div>

    <!-- TABEL USER -->
    <div v-if="loading" class="text-gray-200">Memuat data...</div>
    <table v-else class="bg-white rounded-sm text-[12px] overflow-hidden text-center max-w-md md:max-w-2xl w-full mx-auto">
      <thead class="bg-gray-700 text-white border-b-4">
        <tr>
          <th class="px-2 py-1">No</th>
          <th class="px-2 py-1">Nama</th>
          <th class="px-2 py-1">Email</th>
          <th class="px-2 py-1">No Telp</th>
          <!-- <th class="px-2 py-1">Role</th> -->
          <th class="px-2 py-1">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in paginatedUsers" :key="user.id">

          <td class="px-2 py-1">{{ (currentPage - 1) * perPage + index + 1 }}</td>
          <td class="px-2 py-1">{{ user.name }}</td>
          <td class="px-2 py-1">{{ user.email ? user.email : "-" }}</td>
          <td class="px-2 py-1">{{ user.phone ? user.phone : "-" }}</td>
          <!-- <td class="px-2 py-1 capitalize">{{ user.role }}</td> -->
          <td class="px-2 py-1 text-center space-x-4">
            <button @click="editUser(user)" class="text-blue-500 text-2xl hover:cursor-pointer duration-75">
              <i class='bx bxs-pencil' ></i>
            </button>
            <button @click="deleteUser(user.id)" class="text-red-500 text-2xl hover:cursor-pointer duration-75">
              <i class='bx bxs-trash' ></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination -->
    <div class="flex justify-between items-center space-x-2 max-w-md md:max-w-2xl mx-auto">
      <button
        class="px-3 py-1 bg-gray-200 rounded"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        Prev
      </button>

      <span class="text-slate-100">Halaman {{ currentPage }} dari {{ totalPages }}</span>

      <button
        class="px-3 py-1 bg-gray-200 rounded"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Next
      </button>
    </div>
  </div>
</template>
