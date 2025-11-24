<template>
  <div>
    <h2 class="text-lg font-bold mb-3">Konfirmasi Reservasi</h2>

    <!-- <pre class="bg-gray-200 p-3 rounded text-sm">{{ reservation }}</pre> -->
    <!-- <pre class="bg-gray-200 p-3 rounded text-sm">{{ reservationHelper }}</pre> -->
    <CustomInput
      label="Nama"
      id="name"
      v-model="reservation.name"
      :disabled="true"
      placeholder="Masukkan nama"
    />
    <div class="flex mb-2 justify-between items-center gap-4 w-full">
      <CustomInput
        label="Email"
        id="email"
        type="email"
        v-model="reservation.email"
        :disabled="true"
        placeholder="Masukkan email"
        inputClass="w-1/2"
      />
      <CustomInput
        label="No Telp"
        id="phone"
        v-model="reservation.phone"
        :disabled="true"
        placeholder="Masukkan no telp"
        inputClass="w-1/2"
      />
    </div>
    <div class="flex mb-2 justify-between items-center gap-4 w-full">
      <CustomInput
        label="Tanggal"
        id="date"
        type="date"
        v-model="reservation.date"
        :disabled="true"
        inputClass="w-1/2"
        placeholder="Masukkan tanggal"
      />
      <CustomInput
        label="Jam"
        id="time"
        type="time"
        v-model="reservation.time"
        :disabled="true"
        inputClass="w-1/2"
      />
    </div>
    <button
      class="w-full p-1 mb-2 rounded shadow hover:cursor-not-allowed dark:bg-gray-900 min-h-52 flex items-center flex-col"
    >
      <img v-if="reservationHelper.service_picture" class="w-full max-h-40 object-cover rounded" :src="`http://192.168.1.65:5050/uploads/${reservationHelper.service_picture}`" alt="reservationHelper.service_Image" />
      <img v-else class="w-full max-h-40 object-cover rounded" src="https://placeholdit.com/1200x1200/1f2937/0092b8?text=MyBarber&font=cairo&font_size=120" alt="">
      <p class="mt-1 px-1 text-start w-full">{{ reservationHelper.service_name }}</p>
      <p class="mt-1 px-1 text-xs text-justify line-clamp-2 w-full text-slate-600 dark:text-gray-400">{{ reservationHelper.service_description ? reservationHelper.service_description : "-" }}</p>
      <div class="w-full px-1 flex mt-1 items-center">
        <p class="font-bold text-cyan-600 dark:text-cyan-400 text-2xl text-start w-1/2">{{ formatToK(reservationHelper.service_price) }}</p>
        <p class="mt-1 text-end text-slate-600 dark:text-gray-400 text-xs flex justify-end items-center gap-1 w-1/2">
          <i class='bx bx-time'></i> durasi {{ reservationHelper.service_duration }} menit</p>
      </div>
    </button>
    <CustomInput
      label="Metode Pembayaran"
      id="payment_method"
      v-model="reservation.payment_method"
      type="select"
      :options="[
        { value: 'cash', label: 'Cash' },
        { value: 'transfer', label: 'Transfer' },
        { value: 'ewallet', label: 'eWallet' },
      ]"
    />

    <div class="w-full flex justify-between items-center mt-2">
      <button @click="reservationStore.prevStep" class="bg-gray-500 hover:bg-gray-600 hover:cursor-pointer duration-75 text-white w-1/2 py-2 rounded">Kembali</button>
      <button @click="submit" class="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-500 duration-75 hover:cursor-pointer ml-2 text-white rounded">Simpan Reservasi</button>
    </div>
  </div>
</template>

<script setup>
import api from "@/api/axios";
import { useReservationStore, useReservationStoreHelper } from "@/stores/useReservationStore";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import CustomInput from "@/components/CustomInput.vue";

const reservationStore = useReservationStore();
const reservationStoreHelper = useReservationStoreHelper();
const reservation = reservationStore.reservation;
const reservationHelper = reservationStoreHelper.reservationHelper;;
const router = useRouter();

async function submit() {
  if(reservation.payment_method === "") {
    return toast.error("Metode pembayaran harus diisi!");
  }
  let resId = 0;

  const cleanForm = {
    ...reservation,
    email:
      reservation.email && reservation.email.trim() !== ""
        ? reservation.email.trim()
        : null,
    phone:
      reservation.phone && reservation.phone.trim() !== ""
        ? reservation.phone.trim()
        : null,
    note:
      reservation.note && reservation.note.trim() !== ""
        ? reservation.note.trim()
        : null,
  };
  console.log("Data didapatkan: ", JSON.stringify(cleanForm, null, 2));

  try {
    const res = await api.post("/reservations", cleanForm);
    // console.log(res);
    resId = res.data.id;
    // toast.success("Rerservasi berhasil dibuat.");
  } catch (err) {
    console.error(err);
    const message =
      err.response?.data?.message ||
      err.message ||
      "Terjadi kesalahan saat menyimpan data.";
    toast.error(message);
  }
  reservationStore.reset();
  // router.push({ path: "/my-reservations" });
  router.push({ path: `/my-reservation/detail/payment/${resId}?created-1` });
}

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
</script>
