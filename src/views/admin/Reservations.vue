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
      <div>
        <CustomInput
          label="Nama"
          id="name"
          v-model="form.name"
          :disabled="!!editingId"
          placeholder="Masukkan nama"
        />
        <div class="flex mb-2 justify-between items-center gap-4 w-full">
          <CustomInput
            label="Email"
            id="email"
            type="email"
            v-model="form.email"
            :disabled="!!editingId"
            placeholder="Masukkan email"
            inputClass="w-1/2"
          />
          <CustomInput
            label="No Telp"
            id="phone"
            v-model="form.phone"
            :disabled="!!editingId"
            placeholder="Masukkan no telp"
            inputClass="w-1/2"
          />
        </div>
        <div class="flex mb-2 justify-between items-center gap-4 w-full">
          <CustomInput
            label="Tanggal"
            id="date"
            type="date"
            v-model="form.date"
            :disabled="!!editingId"
            inputClass="w-1/2"
            placeholder="Masukkan tanggal"
          />
          <CustomInput
            label="Jam"
            id="time"
            type="time"
            v-model="form.time"
            :disabled="!!editingId"
            inputClass="w-1/2"
          />
        </div>
        <div v-if="!!editingId" class="flex mb-2 justify-between items-center gap-4 w-full">
          <CustomInput
            label="Nama Layanan"
            id="service"
            v-model="editOther.service"
            :disabled="!!editingId"
            inputClass="w-1/2"
          />
          <CustomInput
            label="Nama Tukang Cukur"
            id="barber"
            v-model="editOther.barber"
            :disabled="!!editingId"
            inputClass="w-1/2"
          />
        </div>
        <div v-else>
          <!-- Service Form -->
          <label for="Service" class="block mb-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Service </span>
            <select :disabled="editingId" v-model="form.service_id" class="w-full border border-gray-200 bg-gray-300 dark:bg-gray-900 shadow p-2 lg:py-3 rounded text-slate-950 dark:text-slate-100" id="Service">
              <option disabled value="">-- Pilih Service --</option>
              <option v-for="s in services" :key="s.id" :value="s.id">
                {{ s.name }} - Rp {{ s.price }}
              </option>
            </select>
          </label>

          <!-- Barber Form -->
          <div v-if="loadingBarbers" class=" text-gray-700 dark:text-gray-200 mb-2">Memuat barber...</div>
          <div v-else-if="availableBarbers.length">
            <label for="Barber" class="block mb-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Barber</span>
              <select v-model="form.barber_id" class="w-full border border-gray-200 bg-gray-300 dark:bg-gray-900 shadow p-2 lg:py-3 rounded text-slate-950 dark:text-slate-100" id="Barber">
                <option disabled value="">-- Pilih Barber --</option>
                <option v-for="b in availableBarbers" :key="b.id" :value="b.id">
                  {{ b.name }}
                </option>
              </select>
            </label>
          </div>
          <div v-else class="text-gray-700 pt-4 pb-2 dark:text-gray-200 mb-2">
            Tidak ada barber tersedia untuk waktu dan layanan ini.
          </div>
        </div>
        <CustomInput
          label="Catatan"
          id="note"
          v-model="form.note"
          :disabled="!!editingId"
          placeholder="Catatan anda jika ada"
        />
        <CustomInput
          label="Metode Pembayaran"
          id="payment_method"
          v-model="form.payment_method"
          type="select"
          :disabled="!!editingId"
          :options="[
            { value: 'cash', label: 'Cash' },
            { value: 'transfer', label: 'Transfer' },
            { value: 'ewallet', label: 'eWallet' },
          ]"
        />
        <div v-if="!!editingId" class="h-1 my-2 w-full bg-gray-300 dark:bg-slate-100 rounded"></div>
        <label v-if="!!editingId" for="Status" class="block">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> Status </span>
          <select v-model="form.status" class="w-full border border-gray-200 bg-gray-300 dark:bg-gray-900 shadow p-2 lg:py-3 rounded text-slate-950 dark:text-slate-100" id="Status">
            <option value="pending">pending</option>
            <option value="ongoing">ongoing</option>
            <option value="confirmed">confirmed</option>
            <option value="cancelled">cancelled</option>
          </select>
        </label>
      </div>
      <button type="submit" class="bg-cyan-600 text-white w-full py-2 rounded hover:cursor-pointer duration-75">
        {{ editingId ? "Update" : "Tambah" }}
      </button>
    </form>

    <div v-if="!isSearch && !showForm" class="max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
      <h2 class="font-semibold text-gray-800 dark:text-gray-100">Filter Reservation</h2>
      <div class="flex flex-col sm:flex-row justify-between items-center my-2 gap-2">
        <div class="flex gap-2 items-center text-[12px]">
          <label class="text-sm text-gray-700 dark:text-gray-200">Tanggal:</label>
          <input
            type="date"
            v-model="selectedDate"
            @change="fetchReservations"
            class="px-2 py-2 lg:py-3 rounded border-gray-300 bg-gray-300 shadow-sm sm:text-sm text-slate-950 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
          <button
            @click="setToday"
            class="p-2 sm:px-3 sm:py-2 border border-gray-300 rounded text-[10] sm:text-sm dark:border-gray-700 dark:text-gray-200 hover:cursor-pointer duration-75"
            :class="{ 'bg-cyan-600 text-slate-100': isToday }"
          >
            Hari Ini
          </button>
          <button
            @click="setAll"
            class="p-2 sm:px-3 sm:py-2 border border-gray-300 rounded text-[10] sm:text-sm dark:border-gray-700 dark:text-gray-200 hover:cursor-pointer duration-75"
            :class="{ 'bg-cyan-600 text-slate-100': !isToday }"
          >
            Semua Tanggal
          </button>
        </div>
        <select
          v-model="selectedStatus"
          @change="fetchReservations"
          class="text-sm border w-full sm:max-w-[150px] border-gray-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded p-2 lg:py-3 shadow-sm "
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="ongoing">Ongoing</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      
    </div>

    <SearchBar placeholder="Cari nama/ email/ no telp cust reservasi ..." @search="handleSearch" />
    <div v-if="paginatedReservations.length > 0">
      <table v-if="!loading" class="dark:bg-slate-600 bg-slate-200 rounded-sm text-[8px] sm:text-[12px] overflow-hidden text-center max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
        <thead class="dark:bg-gray-700 bg-gray-600 text-slate-100 border-b-2 dark:border-slate-100 border-slate-800">
          <tr>
            <th class="px-2 py-1">No</th>
            <th class="px-2 py-1">Nama Cust</th>
            <th class="px-2 py-1">Tanggal/ Jam</th>
            <th class="px-2 py-1">Nama Layanan</th>
            <th class="px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(r, index) in paginatedReservations"
            :key="r.id"
            class="border-b-2 dark:border-b-slate-200 border-b-slate-300"
            :class="{
              'border-l-4 border-l-amber-500': r.status === 'pending',           // Kuning - Menunggu
              'border-l-4 border-l-blue-500': r.status === 'ongoing',           // Biru - Sedang berjalan
              'border-l-4 border-l-emerald-500': r.status === 'confirmed',      // Hijau - Dikonfirmasi
              'border-l-4 border-l-red-500': r.status === 'cancelled',          // Merah - Dibatalkan
              'border-l-4 border-l-orange-500': r.status === 'need_admin_review', // Oranye - Butuh perhatian
              'border-l-4 border-l-gray-400': !r.status || r.status === 'complete'// Abu-abu - Tidak ada status
            }"
            >
            <td class="px-2 py-1 relative text-center">
              {{ (currentPage - 1) * perPage + index + 1 }}
            </td>
            <td class="px-2 py-1 max-w-[5px] sm:max-w-[50px] md:max-w-[80px] truncate text-ellipsis whitespace-nowrap">{{ r.customer?.name ? r.customer.name : "-" }}</td>
            <td class="px-2 py-1">{{ formatDateTime(r.date, r.time)}}</td>
            <td class="px-2 py-1">{{ r.service.name }}</td>
            <td class="px-2 py-1 text-center gap-1 md:gap-4 flex justify-center items-center">
              <button @click="editReservation(r)" title="update" class="text-cyan-500 text-base sm:text-2xl hover:cursor-pointer duration-75">
                <i class='bx bxs-pencil' ></i>
              </button>
              <button @click="deleteReservation(r.id)" title="delete" class="text-rose-500 text-base sm:text-2xl hover:cursor-pointer duration-75">
                <i class='bx bxs-trash' ></i>
              </button>
              <button @click="showDetail(r.id)" title="detail" class="text-emerald-500 text-base sm:text-2xl hover:cursor-pointer duration-75">
                <i class='bx bx-detail'></i>
              </button>
              <div>
                <div
                class="rounded-md text-white"
                :class="{
                  'bg-amber-500': r.payment.status === 'waiting',      // Kuning - Menunggu
                  'bg-emerald-500': r.payment.status === 'accepted',   // Hijau - Diterima
                  'bg-red-500': r.payment.status === 'rejected',       // Merah - Ditolak
                  'bg-orange-500': r.payment.status === 'refund_pending', // Oranye - Pending refund
                  'bg-purple-500': r.payment.status === 'refunded',    // Ungu - Sudah refund
                }"
                >{{ r.payment.status }}</div>
                <button
                  @click="$router.push(`/admin/reservations/${r.id}/payment`)"
                  class="px-3 py-1 rounded text-sm underline hover:cursor-pointer duration-75 text-[8px] sm:text-[12px]"
                >edit payment
                </button>
              </div>
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
      <div v-if="selectedReservation" class="flow-root max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto mt-3">
        <button @click="toggleDetail" class="hover:cursor-pointer duration-75 py-1 w-full text-center rounded bg-cyan-600 text-white">
          {{ isShowDetail ? "Sembunyikan detail" : "Tampilkan detail"}}
        </button>
        <dl v-if="isShowDetail"
          class="mt-1 divide-y divide-gray-200 text-sm *:odd:bg-gray-50 dark:divide-gray-700 dark:*:odd:bg-gray-800"
        >
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Name</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{selectedReservation.customer.name}}</dd>
          </div>
      
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Email/ No Telp</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{selectedReservation.customer.email ? selectedReservation.customer.email : selectedReservation.customer.phone ? selectedReservation.customer.phone : "-"}}</dd>
          </div>
      
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Tanggal/ Jam</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{ formatDateTime(selectedReservation.date, selectedReservation.time)}}</dd>
          </div>
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Nama Service</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{ selectedReservation.service.name }}</dd>
          </div>
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Harga</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">Rp. {{ selectedReservation.service.price }}</dd>
            <dt class="font-medium text-gray-900 dark:text-white">Durasi</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{ selectedReservation.service.duration }} menit</dd>
          </div>
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Nama Barber</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{ selectedReservation.barber.name }}</dd>
          </div>
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Status</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{ selectedReservation.status }}</dd>
          </div>
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Note</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{ selectedReservation.note ? selectedReservation.note : "-" }}</dd>
          </div>
        </dl>
      </div>
    </div>
    <p v-else class="w-full text-slate-400 text-center">Belum ada data</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import api from "@/api/axios";
import { toast } from "vue3-toastify";
import SearchBar from "../../components/SearchBar.vue";
import CustomInput from "../../components/CustomInput.vue";
import Pagination from "../../components/Pagination.vue";
import dayjs from "dayjs";
import 'dayjs/locale/id';

const reservations = ref([]);
const services = ref([]);

const loading = ref(false);
const showForm = ref(false);
const selectedReservation = ref(null);
const selectedStatus = ref("all");
const selectedDate = ref(new Date().toISOString().split("T")[0]);
const isShowDetail = ref(false);
const isSearch = ref(false);
const isToday = ref(true);

const availableBarbers = ref([]);
const loadingBarbers = ref(false);

//for the pagination
const currentPage = ref(1)
const perPage = ref(5)

// for date filter

const setToday = () => {
  selectedDate.value = new Date().toISOString().split("T")[0];
  isToday.value = true;
  fetchReservations();
};
const setAll = () => {
  selectedDate.value = null;
  isToday.value = false;
  fetchReservations();
};

//dayjs
dayjs.locale('id');

// form CRUD
const form = ref({ name: "", email: "", phone: "",  date:"", time:"", note:"", barber_id:"", service_id:"", status:"pending", payment_method:""
});
const editOther = ref({ service: "", barber: ""});
const editingId = ref(null);

const toggleForm = () => {
  showForm.value = !showForm.value;
  if (!showForm.value) {
    form.value = { name: "", email: "", phone: "", date:"", time:"", note:"" };
    editOther.value = { service: "", barber: ""};
    editingId.value = null;
  }
};
const handleSearch = async (query) => {
  if (!query.trim()){
    // isSearch = false
    fetchReservations()
    isSearch.value = false
    return
  }
  try{
    const res = await api.get(`/reservations/search?query=${query}`)
    reservations.value = res.data
    isSearch.value = true
  } catch (err){
    console.error(err);
    const message =
      err.response?.data?.message || // pesan dari backend (res.status().json({ message: "..."}))
      err.message || // pesan dari axios sendiri (misal timeout)
      "Terjadi kesalahan saat menyimpan data."; // fallback pesan default

    toast.error(message);
  }
};

const showDetail = async (id) => {
  const res = await api.get(`/reservations/${id}`)
  selectedReservation.value = res.data
  isShowDetail.value = true
}

const toggleDetail = () => {
  isShowDetail.value = !isShowDetail.value;
}

// fungsi ambil data reservation
const fetchReservations = async () => {
  loading.value = true;
  // const endpoint = `/reservations/?status=${selectedStatus.value}`

  try {
    const res = await api.get(`/reservations`, {
      params: {
        status: selectedStatus.value,
        date: selectedDate.value,
      },
    });
    reservations.value = res.data;
    // console.log(reservations.value)
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const fetchServices = async () => {
  loading.value = true;
  let endpoint = "/services"

  try {
    const res = await api.get(endpoint);
    services.value = res.data;
    // console.log(services.value)
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const fetchAvailableBarbers = async () => {
  if (!form.value.date || !form.value.time || !form.value.service_id) return;

  loadingBarbers.value = true;
  try {
    const res = await api.get(
      `/reservations/check/available-barbers`,
      {
        params: {
          date: form.value.date,
          time: form.value.time,
          service_id: form.value.service_id,
        },
      }
    );
    availableBarbers.value = res.data;
    console.log("Barber tersedia:", res.data);
  } catch (err) {
    console.error(err);
    toast.error("Gagal memuat barber yang tersedia");
  } finally {
    loadingBarbers.value = false;
  }
};

// 👇 Pantau perubahan 3 field penting
watch(
  () => [form.value.date, form.value.time, form.value.service_id],
  ([date, time, service_id]) => {
    if (date && time && service_id) {
      fetchAvailableBarbers();
    } else {
      availableBarbers.value = [];
    }
  }
);

// Pagination logic
const totalPages = computed(() =>
  Math.ceil(reservations.value.length / perPage.value)
);

const paginatedReservations = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return reservations.value.slice(start, end);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

const formatDateTime = (date, time) => {
  if (!date || !time) return "-"
  return dayjs(`${date}T${time}`).format('DD MMM YY, HH:mm')
}

const saveReservation = async () => {
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
    note:
      form.value.note && form.value.note.trim() !== ""
        ? form.value.note.trim()
        : null,
  };
  console.log("Data didapatkan: ", JSON.stringify(cleanForm, null, 2));

  try {
    if (editingId.value){
      await api.put(`/reservations/${editingId.value}/status`, cleanForm);
      toast.success("Data reservation berhasil diupdate.")
    }else {
      await api.post("/reservations", cleanForm)
      toast.success("Data reservation berhasil ditambahkan.")
    }
  } catch (err) {
    console.error(err);
    const message =
      err.response?.data?.message ||
      err.message ||
      "Terjadi kesalahan saat menyimpan data.";
    toast.error(message);
  }

  fetchReservations();
  form.value = { name: "", email: "", phone: "", date:"", time:"", note:"", payment_method:"" };
  editOther.value = { service: "", barber: ""};
  editingId.value = null;
  showForm.value = false;
}

const editReservation = (reservation) => {
  form.value = { name: reservation.customer.name, email:reservation.customer.email, phone:reservation.customer.phone, status: reservation.status, date: reservation.date, time: reservation.time, note: reservation.note, payment_method: reservation.payment.method };
  editOther.value = { service: reservation.service.name, barber: reservation.barber.name}
  // console.log("reservation to edit:", reservation)
  editingId.value = reservation.id;
  showForm.value = true;
};

const deleteReservation = async (id) => {
  if (!confirm("Yakin ingin reservasi ini?")) return;
  try {
    await api.delete(`/reservations/${id}`);
    fetchReservations();
    toast.success("Berhasil menghapus reservasi")
  } catch (err) {
    console.error(err);
      const message =
      err.response?.data?.message || // pesan dari backend (res.status().json({ message: "..."}))
      err.message || // pesan dari axios sendiri (misal timeout)
      "Terjadi kesalahan saat menghapus data."; // fallback pesan default

    toast.error(message);
  }
}

onMounted(() => {
  fetchReservations(),
  fetchServices()
});
</script>