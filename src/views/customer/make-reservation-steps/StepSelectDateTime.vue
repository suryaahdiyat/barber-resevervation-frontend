<template>
  <div>
    <h2 class="text-lg font-bold mb-3">Pilih Jadwal</h2>
    <label for="date" class="block">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-200"> Tanggal </span>
      <input
        v-model="reservation.date"
        type="date"
        id="date"
        :min="today"
        class="mt-0.5 mb-1 w-full px-2 py-2 lg:py-3 rounded border-gray-300 bg-gray-300 shadow-sm sm:text-sm text-slate-950 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
      />
    </label>
    <CustomInput
      label="Jam"
      id="time"
      type="time"
      v-model="reservation.time"
      inputClass="w-1/2"
    />


    <div class="w-full flex justify-between items-center mt-2">
      <button @click="reservationStore.prevStep" class="bg-gray-500 hover:bg-gray-600 hover:cursor-pointer duration-75 text-white w-1/2 py-2 rounded">Kembali</button>
      <button @click="next" class="w-1/2 py-2 bg-cyan-600 hover:bg-cyan-500 duration-75 hover:cursor-pointer ml-2 text-white rounded">Berikutnya</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import api from "@/api/axios";
import CustomInput from "@/components/CustomInput.vue";
import { useReservationStore } from "@/stores/useReservationStore";
import { toast } from "vue3-toastify";

const reservationStore = useReservationStore();
const reservation = reservationStore.reservation;

const availableBarbers = ref([]);
const loadingBarbers = ref(false);

const today = new Date().toISOString().split("T")[0];

const next = () => {
  if(reservation.date && reservation.time) {
    // Validasi minimal 30 menit dari sekarang
    const selectedDateTime = new Date(`${reservation.date}T${reservation.time}`);
    const now = new Date();
    const minBookingTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 menit dari sekarang
    
    if (selectedDateTime <= minBookingTime) {
      return toast.error("Reservasi harus minimal 30 menit dari waktu sekarang");
    }

    if (availableBarbers.value.length === 0){
      toast.error("Tidak tersedia barber diwaktu tersebut, silahkam pilih waktu lain");
    }else {
      let randomIndex = Math.floor(Math.random() * availableBarbers.value.length);
      let barber = availableBarbers.value[randomIndex];
      reservation.barber_id = barber.id;
      // reservationHelper.barber_name = barber.name;
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

// const minTime = computed(() => {
//   const selectedDate = reservation.date;
//   const now = new Date();
//   const t2day = now.toISOString().slice(0, 10);

//   if (selectedDate !== t2day) return "00:00";

//   const hh = String(now.getHours()).padStart(2, "0");
//   const mm = String(now.getMinutes()).padStart(2, "0");
//   const result = `${hh}:${mm}`;
//   console.log(result)
//   return result;
// });



</script>
