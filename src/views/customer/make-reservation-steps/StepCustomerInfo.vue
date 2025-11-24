<template>
  <div>
    <h2 class="text-lg font-bold mb-3">Catatan (Opsional)</h2>

    <CustomInput
      label="Nama"
      id="name"
      v-model="reservation.name"
      placeholder="Masukkan nama"
    />
    <div class="flex mb-2 justify-between items-center gap-4 w-full">
      <CustomInput
        label="Email"
        id="email"
        type="email"
        v-model="reservation.email"
        :disabled="true"
        inputClass="w-1/2"
      />
      <CustomInput
        label="No Telp"
        id="phone"
        v-model="reservation.phone"
        :disabled="true"
        inputClass="w-1/2"
      />
    </div>
    <CustomInput
      label="Catatan (opsional)"
      id="note"
      v-model="reservation.note"
      placeholder="Catatan..."
    />

    <div class="w-full flex justify-between items-center mt-2">
      <button @click="reservationStore.prevStep" class="bg-gray-500 hover:bg-gray-600 hover:cursor-pointer duration-75 text-white w-1/2 py-2 rounded">Kembali</button>
      <button @click="next" class="w-1/2 py-2 bg-cyan-600 hover:bg-cyan-500 duration-75 hover:cursor-pointer ml-2 text-white rounded">Berikutnya</button>
    </div>
  </div>
</template>

<script setup>
import CustomInput from "@/components/CustomInput.vue"
import { useReservationStore } from "@/stores/useReservationStore";
import { toast } from "vue3-toastify";

const reservationStore = useReservationStore();
const reservation = reservationStore.reservation;

//ambil dari data login
reservation.name = "cust"
reservation.email = "cust@mail.id";
reservation.phone = null;

const next = () => {
  if(reservation.name && (reservation.email || reservation.phone)) {
    reservationStore.nextStep();
  } else {
    toast.error("Nama, email atau no telp harus diisi!")
  }
};
</script>
