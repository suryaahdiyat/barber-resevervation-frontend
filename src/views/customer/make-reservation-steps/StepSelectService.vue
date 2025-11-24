<template>
  <div>
    <h2 class="text-lg font-bold mb-3">Pilih Service</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <button
        v-for="service in services"
        :key="service.id"
        @click="select(service.id, service.name, service.description, service.price, service.duration, service.picture)"
        class="w-full p-1 rounded shadow hover:cursor-pointer dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 min-h-52 flex items-center flex-col"
      >
        <img v-if="service.picture" class="w-full max-h-40 object-cover rounded" :src="`http://192.168.1.65:5050/uploads/${service.picture}`" alt="Service Image" />
        <img v-else class="w-full max-h-40 object-cover rounded" src="https://placeholdit.com/1200x1200/1f2937/0092b8?text=MyBarber&font=cairo&font_size=120" alt="">
        <p class="mt-1 px-1 text-start w-full">{{ service.name }}</p>
        <p class="mt-1 px-1 text-xs text-justify line-clamp-2 w-full text-slate-600 dark:text-gray-400">{{ service.description ? service.description : "-" }}</p>
        <div class="w-full px-1 flex mt-1 items-center">
          <p class="font-bold text-cyan-600 dark:text-cyan-400 text-2xl text-start w-1/2">{{ formatToK(service.price) }}</p>
          <p class="mt-1 text-end text-slate-600 dark:text-gray-400 text-xs flex justify-end items-center gap-1 w-1/2">
            <i class='bx bx-time'></i> durasi {{ service.duration }} menit</p>
        </div>
      </button>

      <!-- <button
        v-for="service in services"
        :key="service.id"
        @click="select(service.id)"
        class="w-full p-3 rounded border hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {{ service.name }} - Rp {{ service.price }}
      </button> -->
    </div>
  </div>
</template>

<script setup>
import { useReservationStore, useReservationStoreHelper } from "@/stores/useReservationStore";
import { ref, onMounted } from "vue";
import api from "@/api/axios";

const services = ref([]);
const loading = ref(false);

const reservationStore = useReservationStore();
const reservationStoreHelper = useReservationStoreHelper();

const fetchServices = async () => {
  loading.value = true;
  let endpoint = "/services"

  try {
    const res = await api.get(endpoint);
    services.value = res.data;
    console.log(services.value);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

function select(id, name, desc, price, duration, picture) {
  reservationStore.reservation.service_id = id;
  reservationStoreHelper.reservationHelper.service_name = name;
  reservationStoreHelper.reservationHelper.service_desc = desc;
  reservationStoreHelper.reservationHelper.service_price = price;
  reservationStoreHelper.reservationHelper.service_duration = duration;
  reservationStoreHelper.reservationHelper.service_picture = picture;
  reservationStore.nextStep();
}
// Di dalam <script setup> atau methods:

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

onMounted(fetchServices);
</script>
