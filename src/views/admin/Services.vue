<template>
  <div class="p-4 space-y-6">
    <div class="max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
      <h1 class="text-xl font-semibold dark:text-slate-100 text-slate-950">Kelola Services</h1>
      <!-- Tombol Toggle -->
      <button
        @click="toggleForm"
        class="mt-2 hover:cursor-pointer duration-75 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
      >
        {{ showForm ? "Sembunyikan Form" : "Tampilkan Form" }}
      </button>
    </div>

    <!-- FORM Service -->
    <form v-if="showForm" @submit.prevent="saveService" class="text-slate-100 space-y-4 max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
      <CustomInput
        label="Nama"
        id="name"
        v-model="form.name"
        placeholder="Nama Layanan"
      />
      <div class="flex mb-2 justify-between items-center gap-4 w-full">
        <CustomInput
          label="Harga"
          id="price"
          v-model="form.price"
          placeholder="Harga Layanan"
        />
        <CustomInput
          label="Durasi (menit)"
          id="duration"
          v-model="form.duration"
          placeholder="Durasi Layanan"
        />
      </div>
      <CustomInput
        label="Deskripsi"
        id="description"
        v-model="form.description"
        placeholder="Deskripsi Layanan"
      />
      <div v-if="previewUrl" class="relative mt-3 inline-block">
        <img
          :src="previewUrl"
          alt="Preview"
          class="w-32 h-32 object-cover rounded-lg border"
        />
        <button
          @click="removeImage"
          type="button"
          class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow"
        >
          ✕
        </button>
      </div>

      <!-- Jika belum ada preview baru tapi ada gambar lama -->
      <div v-else-if="!previewUrl && form.picture" class="relative mt-3 inline-block">
        <img
          :src="`http://192.168.1.65:5050/uploads/${form.picture}`"
          alt="Current"
          class="w-32 h-32 object-cover rounded-lg border"
        />
        <button
          @click="removeImage"
          type="button"
          class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow"
        >
          ✕
        </button>
      </div>


      <label for="Gambar" class="block">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> Gambar </span>
        <input
          type="file"
          id="Gambar"
          ref="fileInput"
          @change="handleFileUpload"
          class="mt-0.5 w-full px-2 py-2 lg:py-3 rounded border-gray-300 bg-gray-300 shadow-sm sm:text-sm text-slate-950 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
      </label>
      <!-- <input type="file" @change="handleFileUpload" class="border border-slate-900 text-blue-500" placeholder="Upload gambar"> -->
      <button type="submit" class="bg-cyan-600 text-white w-full py-2 rounded hover:cursor-pointer duration-75">
        {{ editingId ? "Update" : "Tambah" }}
      </button>
    </form>

    <!-- TABEL USER -->
    <SearchBar placeholder="Cari nama service ..." @search="handleSearch" />
    <!-- <div v-if="loading" class="dark:text-gray-200 text-gray-700">Memuat data...</div> -->
    <Loader :visible="loading" />
    <div v-if="paginatedServices.length > 0">
      <table v-if="!loading" class="dark:bg-slate-600 my-2 bg-slate-200 rounded-sm text-[10px] sm:text-[12px] overflow-hidden text-center max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
        <thead class="dark:bg-gray-700 bg-gray-600 text-slate-100 dark:text-slate-100 border-b-2 dark:border-slate-100 border-slate-800">
          <tr>
            <th class="px-2 py-1">No</th>
            <th class="px-2 py-1">Nama</th>
            <!-- <th class="px-2 py-1">Gambar</th> -->
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
            <td class="px-2 py-1">{{ s.duration }} m</td>
            <td class="px-2 py-1 text-center space-x-4">
              <button @click="editService(s)" title="update" class="text-cyan-500 text-base sm:text-2xl hover:cursor-pointer duration-75">
                <i class='bx bxs-pencil' ></i>
              </button>
              <button @click="deleteService(s.id)" title="delete" class="text-rose-500 text-base sm:text-2xl hover:cursor-pointer duration-75">
                <i class='bx bxs-trash' ></i>
              </button>
              <button @click="showDetail(s.id)" title="detail" class="text-emerald-500 text-base sm:text-2xl hover:cursor-pointer duration-75">
                <i class='bx bx-detail'></i>
              </button>
              
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @change-page="handlePageChange"
      />
      
      <div v-if="selectedService" class="flow-root max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto mt-3">
        <button @click="toggleDetail" class="hover:cursor-pointer duration-75 py-1 w-full text-center rounded bg-cyan-600 text-white">
          {{ isShowDetail ? "Sembunyikan detail" : "Tampilkan detail"}}
        </button>
        <dl v-if="isShowDetail"
          class="mt-1 divide-y divide-gray-200 text-sm *:odd:bg-gray-50 dark:divide-gray-700 dark:*:odd:bg-gray-800"
        >
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Name</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{selectedService.name}}</dd>
          </div>
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Gambar</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">
              <img v-if="selectedService.picture" class="w-full my-1" :src="`http://192.168.1.65:5050/uploads/${selectedService.picture}`" alt="Service Image" />
              <div v-else>-</div>
            </dd>
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
    <p v-else class="w-full text-slate-400 text-center">Belum ada data</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "@/api/axios";
import { toast } from "vue3-toastify";
import SearchBar from "../../components/SearchBar.vue";
import Loader from "../../components/Loader.vue";
import Pagination from "../../components/Pagination.vue";
import CustomInput from "../../components/CustomInput.vue";

const services = ref([]);
const loading = ref(false);
const showForm = ref(false);
const selectedService = ref(null);
const isShowDetail = ref(false);

//for the pagination
const currentPage = ref(1);
const perPage = ref(5);

// form CRUD
const form = ref({ name: "", price: "", duration: "",  description:""});
const editingId = ref(null);

const selectedFile = ref(null);
const previewUrl = ref(null);
const fileInput = ref(null)

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const removeImage = () => {
  // Hapus gambar dari preview baru
  previewUrl.value = null
  selectedFile.value = null

  // Hapus gambar dari data lama
  form.value.picture = null

  // 🔥 Kosongkan input file secara manual
  if (fileInput.value) {
    fileInput.value.value = ""
  }
}


const toggleForm = () => {
  showForm.value = !showForm.value;
  if (!showForm.value) {
    // reset form saat disembunyikan
    editingId.value = null;
    form.value = { name: "", harga: "", durasi: "", description: "", picture:"" };
    selectedFile.value = null;
    previewUrl.value = null;
    // perPage = ref(3)
  }
};

// Pagination logic
const totalPages = computed(() =>
  Math.ceil(services.value.length / perPage.value)
  // console.log()
);

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return services.value.slice(start, end);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

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
  isShowDetail.value = true
  // console.log(cust_reservations)
}

const toggleDetail = () => {
  isShowDetail.value = !isShowDetail.value;
}

// CRUD
const saveService = async () => {
  const formData = new FormData();
  formData.append("name", form.value.name);
  formData.append("price", form.value.price);
  formData.append("duration", form.value.duration);
  formData.append("description", form.value.description?.trim() || "");

  // hanya tambahkan file jika user memilih gambar baru
  if (selectedFile.value) {
    formData.append("picture", selectedFile.value);
  } else if (form.value.picture === null) {
    formData.append("picture", "null")
  }

  try {
    let res;
    if (editingId.value) {
      // gunakan method POST dengan _method=PUT agar backend multer lebih mudah
      // formData.append("_method", "PUT");
      res = await api.put(`/services/${editingId.value}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Berhasil mengedit layanan!");
    } else {
      res = await api.post("/services", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Berhasil membuat layanan!");
    }

    console.log(res.data);

    //riset form
    form.value = { name: "", price: "", duration: "", description: "", picture:"" };
    editingId.value = null;
    selectedFile.value = null;
    previewUrl.value = null;
    // 🔥 Kosongkan input file secara manual
    if (fileInput.value) {
      fileInput.value.value = ""
    }
    showForm.value = false;
    fetchServices();
  } catch (err) {
    console.error(err);
    const message =
      err.response?.data?.message ||
      err.message ||
      "Terjadi kesalahan saat menyimpan data.";
    toast.error(message);
  }
};

// saat klik edit
const editService = (service) => {
  showForm.value = true;
  form.value = {
    name: service.name,
    price: service.price,
    duration: service.duration,
    description: service.description,
    picture: service.picture, // simpan path lama dari DB
  };

  // tampilkan gambar lama di preview (tapi jangan masuk ke FormData)
  // previewUrl.value = service.picture ? `${baseURL}/${service.picture}` : null;

  selectedFile.value = null; // kosongkan file baru
  previewUrl.value = null      // reset preview baru
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