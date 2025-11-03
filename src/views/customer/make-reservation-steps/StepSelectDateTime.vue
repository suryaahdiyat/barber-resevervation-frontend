<template>
  <div>
    <h2 class="text-lg font-bold mb-3">Pilih Jadwal</h2>
    <CustomInput
      label="Tanggal"
      id="date"
      type="date"
      v-model="reservation.date"
      inputClass="w-1/2"
      placeholder="Masukkan tanggal"
    />
    <CustomInput
      label="Jam"
      id="time"
      type="time"
      v-model="reservation.time"
      inputClass="w-1/2"
    />

    <button @click="reservationStore.prevStep" class="bg-gray-500 hover:bg-gray-600 hover:cursor-pointer duration-75 text-white px-3 py-1 rounded">Kembali</button>
    <button @click="next" class="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 duration-75 hover:cursor-pointer ml-2 text-white rounded">Lanjut</button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import api from "@/api/axios";
import CustomInput from "@/components/CustomInput.vue";
import { useReservationStore } from "@/stores/useReservationStore";
import { toast } from "vue3-toastify";

const reservationStore = useReservationStore();
const reservation = reservationStore.reservation;

const availableBarbers = ref([]);
const loadingBarbers = ref(false);

const next = () => {
  if(reservation.date && reservation.time) {
    if (availableBarbers.value.length === 0){
      toast.error("Tidak tersedia barber diwaktu tersebut, pilih waktu lain!");
    }else {
      let randomIndex = Math.floor(Math.random() * availableBarbers.value.length);
      reservation.barber_id = availableBarbers.value[randomIndex].id;
      reservationStore.nextStep();
    }
  } else {
    toast.error("Tanggal dan jam harus diisi!")
  }
};

const fetchAvailableBarbers = async () => {
  if (!reservation.date || !reservation.time || !reservation.service_id) return;

  loadingBarbers.value = true;
  try {
    const res = await api.get(
      `/reservations/check/available-barbers`,
      {
        params: {
          date: reservation.date,
          time: reservation.time,
          service_id: reservation.service_id,
        },
      }
    );
    availableBarbers.value = res.data;
    console.log("Barber tersedia:", availableBarbers.value.length);
  } catch (err) {
    console.error(err);
    toast.error("Gagal memuat barber yang tersedia");
  } finally {
    loadingBarbers.value = false;
  }
};

// 👇 Pantau perubahan 3 field penting
watch(
  () => [reservation.date, reservation.time, reservation.service_id],
  ([date, time, service_id]) => {
    if (date && time && service_id) {
      fetchAvailableBarbers();
    } else {
      availableBarbers.value = [];
    }
  }
);
</script>
