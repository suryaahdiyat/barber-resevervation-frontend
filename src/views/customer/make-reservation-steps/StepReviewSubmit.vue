<template>
  <div>
    <h2 class="text-lg font-bold mb-3">Konfirmasi Reservasi</h2>

    <pre class="bg-gray-200 p-3 rounded text-sm">{{ reservation }}</pre>

    <button @click="reservationStore.prevStep" class="mr-2 px-4 py-2 bg-gray-400 rounded">Kembali</button>
    <button @click="submit" class="px-4 py-2 bg-green-600 text-white rounded">Simpan Reservasi</button>
  </div>
</template>

<script setup>
import api from "@/api/axios";
import { useReservationStore } from "@/stores/useReservationStore";
import { useRouter } from "vue-router";

const reservationStore = useReservationStore();
const reservation = reservationStore.reservation;
const router = useRouter();

async function submit() {
  console.log("submitting reservation: ", reservation)
  // await api.post("/api/reservations", reservation);
  // reservationStore.reset();
  // router.push("/my-reservations");
}
</script>
