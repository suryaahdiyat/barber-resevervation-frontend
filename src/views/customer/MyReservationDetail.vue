<template>
  <div class="max-w-3xl mx-auto p-4">
    <h2 class="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
      Pembayaran Reservasi Saya
    </h2>

    <div v-if="loading">Memuat data...</div>

    <div v-else>
      <!-- Countdown -->
      <div
        v-if="countdown && paymentData.status === 'waiting'"
        class="mt-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 p-3 rounded-lg text-center font-medium"
      >
        Sisa waktu pembayaran:
        <span class="font-bold">{{ countdown }}</span>
      </div>

      <!-- Kalau expired -->
      <div
        v-if="paymentExpired || paymentData.status === 'rejected'"
        class="mt-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded-lg text-center font-medium"
      >
        ⛔ Waktu pembayaran sudah habis
      </div>
      <div v-if="paymentExpired && paymentData.status === 'accepted'"
        class="bg-green-100 text-green-800 p-4 rounded-lg mt-5 text-center"
      >
        Pembayaran sudah diverifikasi ✔
      </div>
      <div v-if="paymentExpired && paymentData.status === 'refund_pending'"
        class="bg-orange-100 text-orange-800 p-4 rounded-lg mt-5 text-center"
      >
        Dalam proses refund
      </div>
      <div v-if="paymentExpired && paymentData.status === 'refunded'"
        class="bg-purple-100 text-purple-800 p-4 rounded-lg mt-5 text-center"
      >
        Refund selesai
      </div>


      <div v-if="paymentData" class="flow-root max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto mt-3">
        <dl
          class="mt-1 divide-y divide-gray-200 text-sm *:odd:bg-gray-50 dark:divide-gray-700 dark:*:odd:bg-gray-800"
        >
      
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Tanggal/ Jam</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{ formatDateTime(paymentData.reservation.date, paymentData.reservation.time)}}</dd>
          </div>
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Nama Service</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{ paymentData.reservation.service.name }}</dd>
          </div>
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Harga</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{ formatToK(paymentData.reservation.service.price) }}</dd>
          </div>
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Status Pembayaran</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{ paymentData.status }}</dd>
          </div>
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Bukti Pembayaran</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">
              <img v-if="paymentData.proof" class="w-full my-1" :src="`http://192.168.1.65:5050/uploads/${paymentData.proof}`" alt="Proof Image" />
              <div v-else>-</div>
            </dd>
            <!-- <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">
              <img v-if="paymentData.proof" class="w-full my-1" :src="`http://localhost:5050/uploads/${paymentData.proof}`" alt="Proof Image" />
              <div v-else>-</div>
            </dd> -->
          </div>
        </dl>
      </div>

      <form @submit.prevent="savePayment" class="text-slate-100 space-y-2 max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
        <CustomInput
          label="Metode Pembayaran"
          id="payment_method"
          v-model="form.payment_method"
          type="select"
          :options="[
            { value: 'cash', label: 'Cash' },
            { value: 'transfer', label: 'Transfer' },
            { value: 'ewallet', label: 'eWallet' },
          ]"
        />

        <div v-if="previewUrl" class="relative mt-2 inline-block">
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
        <div v-else-if="!previewUrl && form.proof" class="relative mt-2 inline-block">
          <img
            :src="`http://192.168.1.65:5050/uploads/${form.proof}`"
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
            :disabled="paymentExpired"
            class="mt-0.5 w-full px-2 py-2 lg:py-3 rounded border-gray-300 bg-gray-300 shadow-sm sm:text-sm text-slate-950 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </label>
        <button
        type="submit"
        :disabled="paymentExpired"
        class="text-white w-full py-2 rounded duration-75"
        :class="!paymentExpired ? 'bg-cyan-600 hover:cursor-pointer' : 'bg-rose-600 hover:cursor-not-allowed'"
        >
          <!-- {{ !paymentExpired ? "Update Pembayaran" : "Pemabayaran Melewati Waktu" }}  -->
            Update Pembayaran
        </button>
      </form>

      <div class="max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
        <div class="h-1 mt-2 my-2 w-full bg-gray-300 dark:bg-slate-100 rounded"></div>

        <button
          @click="$router.back()"
          class="bg-gray-500 hover:bg-gray-600 hover:cursor-pointer duration-75 text-white px-3 py-1 rounded w-full"
        >
          Kembali
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/api/axios";
import { toast } from "vue3-toastify";
import CustomInput from "../../components/CustomInput.vue";

const props = defineProps({ id: String });
const reservationId = props.id;
const loading = ref(true);
const paymentData = ref({});

const selectedFile = ref(null);
const previewUrl = ref(null);
const fileInput = ref(null);


const countdown = ref("");
const paymentExpired = ref(false);
let timer = null;

const route = useRoute();

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
};

const removeImage = () => {
  // Hapus gambar dari preview baru
  previewUrl.value = null
  selectedFile.value = null

  // Hapus gambar dari data lama
  form.value.proof = null

  // 🔥 Kosongkan input file secara manual
  if (fileInput.value) {
    fileInput.value.value = ""
  }
}

import dayjs from "dayjs";
import 'dayjs/locale/id';

const form = ref({
  payment_method: "",
  proof: null
});

const formatDateTime = (date, time) => {
  if (!date || !time) return "-"
  return dayjs(`${date}T${time}`).format('DD MMM YY, HH:mm')
}

const savePayment = async () => {
  const formData = new FormData();
  formData.append("payment_method", form.value.payment_method);
  
  // hanya tambahkan file jika user memilih gambar baru
  if (selectedFile.value) {
    formData.append("proof", selectedFile.value);
  } else if (form.value.proof === null) {
    formData.append("proof", "null")
  }

  try {
    let res;
    res = await api.put(`/payments/${paymentData.value.id}/status-proof`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Berhasil mengedit pembayaran!");

    // console.log(res.data);

    //riset form
    form.value = { payment_method: "", proof:"" };
    selectedFile.value = null;
    previewUrl.value = null;
    // 🔥 Kosongkan input file secara manual
    if (fileInput.value) {
      fileInput.value.value = ""
    }
    fetchPayments();
  } catch (err) {
    console.error(err);
    const message =
      err.response?.data?.message ||
      err.message ||
      "Terjadi kesalahan saat menyimpan data.";
    toast.error(message);
  }
}

const fetchPayments = async () => {
  loading.value = true;
  // console.log(reservationId);
  try {
    const res = await api.get(`/payments/by-reservation/${reservationId}`);
    paymentData.value = res.data;
    console.log(paymentData.value)
    form.value.payment_method = paymentData.value.method;
    form.value.proof = paymentData.value.proof;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

if(route.query.created){
  // toast.success("Reservasi berhasil dibuat.");
  toast.success("Rerservasi berhasil dibuat.");
}

function startCountdown() {
  if (!paymentData.value) return;

  // Clear previous timer
  if (timer) clearInterval(timer);

  // Jika sudah diterima → langsung matikan semua
  if (["accepted", "rejected", "refund_pending", "refunded"].includes(paymentData.value.status)) {
    countdown.value = "00:00";
    paymentExpired.value = true;
    return;
  }

  const createdAt = new Date(paymentData.value.created_at);
  // const deadline = new Date(createdAt.getTime() + 30 * 60 * 1000); // 30 menit
  const deadline = new Date(createdAt.getTime() + 30 * 60 * 1000); // 5 menit
  const halfTime = new Date(createdAt.getTime() + 15 * 60 * 1000); // 50% = 2.5 menit
  let halfTimeNotified = false;

  timer = setInterval(() => {
    const now = new Date();
    const diff = deadline - now;

    // Notifikasi saat 50% waktu
    if (!halfTimeNotified && now >= halfTime) {
      toast.warning("Cepat! Sisa waktu bayar tinggal setengah!");
      halfTimeNotified = true;
    }

    if (diff <= 0) {
      countdown.value = "00:00";
      paymentExpired.value = true;
      clearInterval(timer);
      return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    countdown.value =
      `${minutes.toString().padStart(2, "0")}:` +
      `${seconds.toString().padStart(2, "0")}`;
  }, 1000);
};

function formatToK(number) {
    if (number === null || number === undefined) {
        return 'Rp. -'; // Handle null atau undefined
    }

    // Pastikan input adalah angka, lalu bagi 1000
    const valueInK = Number(number) / 1000;
    
    // Gunakan toLocaleString untuk memastikan pemisah ribuan (jika perlu)
    // dan toFixed(0) untuk menghilangkan desimal jika input sudah kelipatan 1000
    const formattedValue = valueInK.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    return `Rp. ${formattedValue}K`;
}

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

// onMounted(fetchPayments);
onMounted(async () => {
  await fetchPayments(); // fungsi kamu ambil paymentData
  startCountdown();
});
</script>
