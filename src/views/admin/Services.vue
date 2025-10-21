<template>
  <div class="p-4 space-y-6">
    <div class="max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
      <h1 class="text-xl font-semibold dark:text-slate-100 text-slate-950">Kelola Services</h1>
      <!-- Tombol Toggle -->
      <button
        @click="toggleForm"
        class="mt-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
      >
        {{ showForm ? "Sembunyikan Form" : "Tampilkan Form" }}
      </button>
    </div>

    <!-- FORM Service -->
    <form v-if="showForm" @submit.prevent="saveService" class="text-slate-100 space-y-4 max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
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
        <label for="Price" class="block w-1/2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> Harga </span>
          <input
            v-model="form.price"
            type="number"
            id="Price"
            class="mt-0.5 w-full px-2 py-2 lg:py-3 rounded border-gray-300 bg-gray-300 shadow-sm sm:text-sm text-slate-950 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </label>
        <label for="duration" class="block w-1/2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> Durasi </span>
          <input
            v-model="form.duration"
            type="number"
            id="duration"
            class="mt-0.5 w-full px-2 py-2 lg:py-3 rounded border-gray-300 bg-gray-300 shadow-sm sm:text-sm text-slate-950 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </label>
      </div>
      <label for="Description" class="block">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> Deskripsi </span>
        <input
          v-model="form.description"
          type="text"
          id="Description"
          class="mt-0.5 w-full px-2 py-2 lg:py-3 rounded border-gray-300 bg-gray-300 shadow-sm sm:text-sm text-slate-950 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
      </label>
      <button type="submit" class="bg-cyan-600 text-white w-full py-2 rounded hover:cursor-pointer duration-75">
        {{ editingId ? "Update" : "Tambah" }}
      </button>
    </form>

    <!-- TABEL USER -->
    <SearchBar placeholder="Cari nama service ..." @search="handleSearch" />
    <!-- <div v-if="loading" class="dark:text-gray-200 text-gray-700">Memuat data...</div> -->
    <Loader :visible="loading" />
    <table v-if="!loading" class="dark:bg-slate-600 bg-slate-200 rounded-sm text-[12px] overflow-hidden text-center max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
      <thead class="dark:bg-gray-700 bg-gray-600 text-slate-100 dark:text-slate-100 border-b-2 dark:border-slate-100 border-slate-800">
        <tr>
          <th class="px-2 py-1">No</th>
          <th class="px-2 py-1">Nama</th>
          <th class="px-2 py-1">Harga</th>
          <th class="px-2 py-1">Durasi</th>
          <th class="px-2 py-1">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(s, index) in paginatedServices" :key="s.id" class="border-b-2 dark:border-slate-200 border-slate-300">

          <td class="px-2 py-1">{{ (currentPage - 1) * perPage + index + 1 }}</td>
          <td class="px-2 py-1">{{ s.name }}</td>
          <td class="px-2 py-1">Rp. {{ s.price }}</td>
          <td class="px-2 py-1">{{ s.duration }} menit</td>
          <td class="px-2 py-1 text-center space-x-4">
            <button @click="editService(s)" title="update" class="text-cyan-500 text-2xl hover:cursor-pointer duration-75">
              <i class='bx bxs-pencil' ></i>
            </button>
            <button @click="deleteService(s.id)" title="delete" class="text-rose-500 text-2xl hover:cursor-pointer duration-75">
              <i class='bx bxs-trash' ></i>
            </button>
            <button @click="showDetail(s.id)" title="detail" class="text-emerald-500 text-2xl hover:cursor-pointer duration-75">
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

    <div v-if="selectedService" class="flow-root max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
      <dl
        class="-my-3 divide-y divide-gray-200 text-sm *:even:bg-gray-50 dark:divide-gray-700 dark:*:even:bg-gray-800"
      >
        <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt class="font-medium text-gray-900 dark:text-white">Name</dt>
    
          <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{selectedService.name}}</dd>
        </div>
    
        <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt class="font-medium text-gray-900 dark:text-white">Harga</dt>
    
          <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">Rp. {{selectedService.price}}</dd>
        </div>
    
        <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt class="font-medium text-gray-900 dark:text-white">Durasi</dt>
    
          <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{selectedService.duration}} m</dd>
        </div>
    
        <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
          <dt class="font-medium text-gray-900 dark:text-white">Deskripsi</dt>
    
          <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{selectedService.description ? selectedService.description : "-"}}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/api/axios";
import { toast } from "vue3-toastify";
import SearchBar from "../../components/SearchBar.vue";
import Loader from "../../components/Loader.vue";

const services = ref([]);
const loading = ref(false);
const showForm = ref(false);
const selectedService = ref(null);

//for the pagination
const currentPage = ref(1);
const perPage = ref(5);

// form CRUD
const form = ref({ name: "", price: "", duration: "",  description:""});
const editingId = ref(null);

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
  Math.ceil(services.value.length / perPage.value)
);

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return services.value.slice(start, end);
});

//belum work
const handleSearch = async (query) => {
  if (!query.trim()){
    return fetchServices()
  }
  try{
    const res = await api.get(`/services/search?query=${query}`)
    // await new Promise((resolve) => setTimeout(resolve, 800)); // simulasi delay 0.8 detik
    services.value = res.data
  } catch (err){
    // console.error(err);
    const message =
      err.response?.data?.message || // pesan dari backend (res.status().json({ message: "..."}))
      err.message || // pesan dari axios sendiri (misal timeout)
      "Terjadi kesalahan saat menyimpan data."; // fallback pesan default

    toast.error(message);
  }
};


// fungsi ambil data service
const fetchServices = async () => {
  loading.value = true;
  let endpoint = "/services"

  try {
    const res = await api.get(endpoint);
    // await new Promise((resolve) => setTimeout(resolve, 800)); // simulasi delay 0.8 detik
    services.value = res.data;
    // console.log(services.value)
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const showDetail = async (id) => {
  const res = await api.get(`/services/${id}`)
  selectedService.value = res.data
  // console.log(cust_reservations)
}

// CRUD
const saveService = async () => {
  const cleanForm = {
    ...form.value,
    description:
      form.value.description && form.value.description.trim() !== ""
        ? form.value.description.trim()
        : null,
  };
  console.log("Data dikirim:", JSON.stringify(cleanForm, null, 2));
  try {
    if (editingId.value) {
      const res = await api.put(`/services/${editingId.value}`, cleanForm);
      toast.success("Berhasil mengedit layanan!")
      console.log(res.data);
    } else {
      const res = await api.post("/services", cleanForm);
      toast.success("Berhasil membuat layanan!")
      console.log(res.data);
    }
    form.value = { name: "", price: "", duration: "", description: "" };
    editingId.value = null;
    fetchServices();
  } catch (err) {
    console.error(err);
    const message =
      err.response?.data?.message || // pesan dari backend (res.status().json({ message: "..."}))
      err.message || // pesan dari axios sendiri (misal timeout)
      "Terjadi kesalahan saat menyimpan data."; // fallback pesan default
    toast.error(message);
  }
};

const editService = (service) => {
  form.value = { name: service.name, price: service.price, duration: service.duration, description: service.description };
  editingId.value = service.id;
};

const deleteService = async (id) => {
  if (!confirm("Yakin ingin hapus service ini?")) return;
  try {
    await api.delete(`/services/${id}`);
    fetchServices();
    toast.success("Berhasil menghapus layanan!")
  } catch (err) {
    console.error(err);
      const message =
      err.response?.data?.message || // pesan dari backend (res.status().json({ message: "..."}))
      err.message || // pesan dari axios sendiri (misal timeout)
      "Terjadi kesalahan saat menghapus data."; // fallback pesan default

    toast.error(message);
  }
};

onMounted(fetchServices);
</script>