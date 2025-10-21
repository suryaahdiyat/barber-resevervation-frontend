<template>
  <div class="p-4 space-y-6">
    <div class="max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
      <h1 class="text-xl font-semibold dark:text-slate-100 text-slate-950">Kelola Reservation</h1>
      <!-- Tombol Toggle -->
      <button
        @click="toggleForm"
        class="mt-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
      >
        {{ showForm ? "Sembunyikan Form" : "Tampilkan Form" }}
      </button>
    </div>

    <!-- FORM Reservation -->
    <form v-if="showForm" @submit.prevent="saveReservation" class="text-slate-100 space-y-4 max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
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
      <div class="flex justify-between items-center gap-4 w-full">

        <label for="Date" class="block w-1/2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> Tanggal </span>
          <input
            v-model="form.date"
            type="date"
            id="Date"
            class="mt-0.5 w-full px-2 py-2 lg:py-3 rounded border-gray-300 bg-gray-300 shadow-sm sm:text-sm text-slate-950 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </label>
        <label for="Time" class="block w-1/2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> Jam </span>
          <input
            v-model="form.time"
            type="time"
            id="Time"
            class="mt-0.5 w-full px-2 py-2 lg:py-3 rounded border-gray-300 bg-gray-300 shadow-sm sm:text-sm text-slate-950 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </label>
      </div>
      <label for="Note" class="block">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> Note </span>
        <input
          v-model="form.note"
          type="text"
          id="Note"
          class="mt-0.5 w-full px-2 py-2 lg:py-3 rounded border-gray-300 bg-gray-300 shadow-sm sm:text-sm text-slate-950 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
      </label>
      <button type="submit" class="bg-cyan-600 text-white w-full py-2 rounded hover:cursor-pointer duration-75">
        {{ editingId ? "Update" : "Tambah" }}
      </button>
    </form>

    <SearchBar placeholder="Cari tanggal/waktu reservasi ..." @search="handleSearch" />
    <div v-if="loading" class="dark:text-gray-200 text-gray-700">Memuat data...</div>
    <table v-else class="dark:bg-slate-600 bg-slate-200 rounded-sm text-[12px] overflow-hidden text-center max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
      <thead class="dark:bg-gray-700 bg-gray-600 text-slate-100 dark:text-slate-100 border-b-2 dark:border-slate-100 border-slate-800">
        <tr>
          <th class="px-2 py-1">No</th>
          <th class="px-2 py-1">Nama Cust</th>
          <th class="px-2 py-1">Tanggal/ Jam</th>
          <th class="px-2 py-1">Email/ No Telp</th>
          <th class="px-2 py-1">Status</th>
          <th class="px-2 py-1">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, index) in paginatedReservations" :key="r.id" class="border-b-2 dark:border-slate-200 border-slate-300">
          <td class="px-2 py-1">{{ (currentPage - 1) * perPage + index + 1 }}</td>
          <td class="px-2 py-1">{{ r.customer?.name ? r.customer.name : "-" }}</td>
          <td class="px-2 py-1">{{ formatDateTime(r.date, r.time)}}</td>
          <td class="px-2 py-1">{{ r.customer?.email ? r.customer.email : r.customer?.phone ? r.customer.phone : "-" }}</td>
          <td class="px-2 py-1">{{ r.status }}</td>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/api/axios";
import { toast } from "vue3-toastify";
import SearchBar from "../../components/SearchBar.vue";
import dayjs from "dayjs";
// Import bahasa Indonesia
import 'dayjs/locale/id';

const reservations = ref([]);
const loading = ref(false);
const showForm = ref(false);
const selectedReservation = ref(null)
// let cust_reservations = ref(null)
// let isSearch = false

//for the pagination
const currentPage = ref(1)
const perPage = ref(5)

//dayjs
dayjs.locale('id');

// form CRUD
const form = ref({ name: "", email: "", phone: "",  date:"", time:"", note:"", barber_id:"", service_id:""});
const editingId = ref(null);

const toggleForm = () => {
  showForm.value = !showForm.value;
  if (!showForm.value) {
    // reset form saat disembunyikan
    // editingId.value = null;
    form.value = { name: "", email: "", phone: "", role: "cashier" };
    // perPage = ref(3)
  }
};
const handleSearch = async (query) => {
  if (!query.trim()){
    // isSearch = false
    return fetchReservations()
  }
  try{
    const res = await api.get(`/users/search?query=${query}`)
    users.value = res.data
    isSearch = true
  } catch (err){
    console.error(err);
    const message =
      err.response?.data?.message || // pesan dari backend (res.status().json({ message: "..."}))
      err.message || // pesan dari axios sendiri (misal timeout)
      "Terjadi kesalahan saat menyimpan data."; // fallback pesan default

    toast.error(message);
  }
}

// fungsi ambil data user
const fetchReservations = async () => {
  loading.value = true;
  let endpoint = "/reservations"

  try {
    const res = await api.get(endpoint);
    reservations.value = res.data;
    console.log(reservations.value)
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Pagination logic
const totalPages = computed(() =>
  Math.ceil(reservations.value.length / perPage.value)
);

const paginatedReservations = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return reservations.value.slice(start, end);
});

const formatDateTime = (date, time) => {
  if (!date || !time) return "-"
  return dayjs(`${date}T${time}`).format('DD MMM YY, HH:mm')
}

onMounted(fetchReservations);
</script>