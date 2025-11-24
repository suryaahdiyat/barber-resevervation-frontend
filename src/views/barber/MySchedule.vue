<template>
  <div class="max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto p-4">
    <p class="dark:text-slate-100 text-slate-950 text-lg font-bold mb-2">Jadwal Saya</p>

    <div class="max-w-md md:max-w-2xl mx-auto lg:max-w-4xl mb-2">
      <div class="flex gap-2 items-center text-[12px]">
        <label class="text-sm text-gray-700 dark:text-gray-200">Tanggal:</label>
        <input
          type="date"
          v-model="selectedDate"
          @change="fetchMySchedules"
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
      <div class="flex gap-2 flex-wrap mt-2">
        <button
          v-for="reservationStatus in [
            { key: 'pending', label: 'Pending', inactive: 'border-yellow-600 text-yellow-600', active:'bg-yellow-600 text-slate-100'},
            { key: 'confirmed', label: 'Selesai', inactive: 'border-cyan-600 text-cyan-600', active:'bg-cyan-600 text-slate-100' }
          ]"
          :key="reservationStatus.key"
          @click="filterReservationStatus(reservationStatus.key)"
          class="px-3 py-2 rounded-4xl hover:cursor-pointer duration-75 border"
          :class="selectedStatus === reservationStatus.key ? reservationStatus.active : reservationStatus.inactive"
        >
          {{ reservationStatus.label }}
        </button>
      </div>
    </div>
    <div v-if="reservations.length > 0" class="space-y-2">
      <button
        v-for="r in reservations"
        :key="r.id"
        @click="$router.push(`/my-reservation/detail/payment/${r.id}`)"
        class="w-full py-2 px-2 border border-slate-300 hover:cursor-pointer duration-75 rounded-lg shadow"
      >
        <div class="mt-1 px-1 flex text-start w-full justify-between items-center">
          <p class="w-3/4">{{ r.service.name }}</p>
        </div>
        <p class="mt-1 px-1 text-start w-full text-xs text-slate-600 dark:text-gray-400">metode pembayaran {{ r.payment.method }}</p>
        <div class=" w-full px-1 flex mt-1 items-center">
          <p class="font-bold text-cyan-600 dark:text-cyan-400 text-2xl text-start w-1/2">{{ formatToK(r.service.price) }}</p>
          <div class="w-1/2 text-end">
            <div class="text-[10px] text-slate-950 dark:text-slate-100">
              {{ formatDate(r.date) }}, {{ formatTime(r.time) }}
            </div>
            <div class="text-[8px] text-gray-500">
              {{ formatRelativeDate(r.date) }}
            </div>
          </div>
        </div>
      </button>
    </div>
    <div v-else class="text-slate-400 w-full text-center">tidak ada data</div>
  </div>
</template>

<script setup>
import api from "@/api/axios";
import { ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import { useRoute } from "vue-router";
import { formatRelativeDate, formatDate, formatTime } from "../../utils/formatRelativeDate.js"
import dayjs from "dayjs";
import 'dayjs/locale/id';

const reservations = ref([]);
const loading = ref(false);
const selectedStatus = ref("pending");
const selectedDate = ref(new Date().toISOString().split("T")[0]);
const isToday = ref(true);

const route = useRoute();
//dayjs
dayjs.locale('id');

const setToday = () => {
  selectedDate.value = new Date().toISOString().split("T")[0];
  isToday.value = true;
  fetchMySchedules();
};
const setAll = () => {
  selectedDate.value = null;
  isToday.value = false;
  fetchMySchedules();
};

const filterReservationStatus = (key) => {
  selectedStatus.value = key
  fetchMySchedules()
}

const fetchMySchedules = async () => {
  // nanti abil dari login
  const barberId = 2;
  const endpoint = `reservations/barber/${barberId}`;

  loading.value = true;
  try {
    const res = await api.get(endpoint, {
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

// const statusColors = {
//   pending:  "yellow-600",
//   confirmed: "cyan-600",
// };


onMounted(fetchMySchedules);
</script>