<template>
  <div class="max-w-3xl mx-auto p-4">
    <h2 class="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
      Pembayaran Reservasi dengan detail
    </h2>

    <div v-if="loading">Memuat data...</div>

    <div v-else>
      <div v-if="paymentData" class="flow-root max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto mt-3">
        <dl
          class="mt-1 divide-y divide-gray-200 text-sm *:odd:bg-gray-50 dark:divide-gray-700 dark:*:odd:bg-gray-800"
        >
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Nama Pelanggan</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{paymentData.reservation.customer.name}}</dd>
          </div>
      
          <div class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt class="font-medium text-gray-900 dark:text-white">Email/ No Telp</dt>
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{paymentData.reservation.customer.email ? paymentData.reservation.customer.email : paymentData.reservation.customer.phone ? paymentData.reservation.customer.phone : "-"}}</dd>
          </div>
      
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
      
            <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">Rp. {{ paymentData.reservation.service.price }}</dd>
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
            class="mt-0.5 w-full px-2 py-2 lg:py-3 rounded border-gray-300 bg-gray-300 shadow-sm sm:text-sm text-slate-950 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </label>
        <button type="submit" class="bg-cyan-600 text-white w-full py-2 rounded hover:cursor-pointer duration-75">
          Update Pembayaran
        </button>
      </form>

      <div class="max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
        <div class="h-1 mt-2 my-2 w-full bg-gray-300 dark:bg-slate-100 rounded"></div>
        <div class="flex flex-col sm:flex-row gap-2 my-2">
          <button
            v-if="paymentData.status !== 'accepted'"
            @click="confirmPayment"
            class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded transition-colors"
          >
            Konfirmasi Pembayaran
          </button>

          <button
            v-if="paymentData.status !== 'rejected'"
            @click="rejectPayment"
            class="flex-1 bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded transition-colors"
          >
            Tolak Pembayaran
          </button>
        </div>

        <button
          @click="$router.back()"
          class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded w-full"
        >
          Kembali
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
    // if (editingId.value) {
      // gunakan method POST dengan _method=PUT agar backend multer lebih mudah
      // formData.append("_method", "PUT");
    res = await api.put(`/payments/${paymentData.value.id}/by-admin`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Berhasil mengedit pembayaran!");
    // } 
    // else {
    //   res = await api.post("/payments", formData, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   });
    //   toast.success("Berhasil membuat layanan!");
    // }

    console.log(res.data);

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

const confirmPayment = async () => {
  try {
    await api.patch(`/payments/${paymentData.value.id}/status`, {
      status: "accepted"
    });
    paymentData.value.status = "accepted";
  } catch (err) {
    console.error(err);
  }
};

const rejectPayment = async () => {
  try {
    await api.patch(`/payments/${paymentData.value.id}/status`, {
      status: "rejected"
    });
    paymentData.value.status = "rejected";
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchPayments);

</script>
