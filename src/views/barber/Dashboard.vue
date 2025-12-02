<template>
  <div class="max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
    <div class="">
      <div class="space-y-4 my-3">
        <details
          class="group border-s-4 border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 [&_summary::-webkit-details-marker]:hidden"
          open
        >
          <summary class="flex items-center justify-between gap-1.5 text-gray-900 dark:text-white">
            <h2 class="font-medium mb-2">Absensi Barber</h2>   
            <svg
              class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180 hover:cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div v-if="barber">
            <table v-if="!loadingBarber" class="dark:bg-slate-600 bg-slate-200 rounded-sm text-[8px] sm:text-[12px] overflow-hidden text-center max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
              <thead class="dark:bg-gray-700 bg-gray-600 text-slate-100 border-b-2 dark:border-slate-100 border-slate-800">
                <tr>
                  <th class="px-2 py-1">Nama</th>
                  <th class="px-2 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  :key="barber.id"
                  class="border-b-2 dark:border-b-slate-200 border-b-slate-300"
                >
                  <td class="px-2 py-1">{{ barber.name }}</td>
                  <td class="px-2 py-1 text-center gap-1 md:gap-4 flex justify-center items-center">
                    <button
                      v-if="!barber.is_present"
                      @click="handlePresent(barber.id)" 
                      title="Tandai Hadir" 
                      class="bg-rose-500 hover:bg-rose-600 hover:cursor-pointer text-white px-3 py-1 rounded text-sm duration-75"
                    >
                      Off
                    </button>
                    <button
                      v-else
                      @click="handlePresent(barber.id)" 
                      title="Tandai Tidak Hadir" 
                      class="bg-emerald-500 hover:bg-emerald-600 hover:cursor-pointer text-white px-3 py-1 rounded text-sm duration-75"
                    >
                      On
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </div>
      <div class="space-y-4 my-3">
        <details
          class="group border-s-4 border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 [&_summary::-webkit-details-marker]:hidden"
          open
        >
          <summary class="flex items-center justify-between gap-1.5 text-gray-900 dark:text-white">
            <h2 class="font-medium mb-2">Reservasi Anda Hari Ini</h2>   
            <svg
              class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180 hover:cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div v-if="paginatedReservs.length > 0">
            <table v-if="!loadingReservs" class="dark:bg-slate-600 bg-slate-200 rounded-sm text-[8px] sm:text-[12px] overflow-hidden text-center max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
              <thead class="dark:bg-gray-700 bg-gray-600 text-slate-100 border-b-2 dark:border-slate-100 border-slate-800">
                <tr>
                  <th class="px-2 py-1">No</th>
                  <th class="px-2 py-1">Nama Cust</th>
                  <th class="px-2 py-1">Tanggal/ Jam</th>
                  <!-- <th class="px-2 py-1">Status</th> -->
                  <th class="px-2 py-1">Nama Layanan</th>
                  <!-- <th class="px-2 py-1">Aksi</th> -->
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(r, index) in paginatedReservs"
                  :key="r.id"
                  class="border-b-2 dark:border-b-slate-200 border-b-slate-300"
                >
                  <td class="px-2 py-1 relative text-center">
                    {{ (currentPageReservs - 1) * perPageReservs + index + 1 }}
                  </td>
                  <td class="px-2 py-1">{{ r.customer?.name ? r.customer.name : "-" }}</td>
                  <td class="px-2 py-1">{{ formatDateTime(r.date, r.time)}}</td>
                  <!-- <td class="px-2 py-1">{{ r.status }}</td> -->
                  <td class="px-2 py-1">{{ r.service.name }}</td>
                  <!-- <td>
                    <button
                      @click="$router.push(`/admin/reservations/${r.id}/payment`)"
                      class="px-3 py-1 rounded text-sm underline hover:cursor-pointer duration-75 text-[8px] sm:text-[12px]"
                    >edit payment
                    </button>
                  </td> -->
                </tr>
              </tbody>
            </table>
            <!-- Pagination -->
            <Pagination
              :currentPage="currentPageReservs"
              :totalPages="totalPagesReservs"
              @change-page="handlePageChangeReservs"
            />
          </div>
          <p v-else class="w-full text-slate-400 text-center py-4">
            {{ loadingReservs ? 'Loading...' : 'Tidak ada reservasi hari ini' }}
          </p>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Pagination from "../../components/Pagination.vue";
import api from "@/api/axios";
import dayjs from "dayjs";
import 'dayjs/locale/id';
import { toast } from "vue3-toastify";

const barber = ref([]);
const loadingBarber = ref(false);
const reservations = ref([]);
const loadingBarbers = ref(false);
const loadingReservs = ref(false);
const loading = ref(false);
const is_present = ref(false);
const userId = 4; // ganti dengan user ID nanti
const selectedDate = ref(new Date().toISOString().split("T")[0]);

const currentPageReservs  = ref(1);
const perPageReservs = ref(5);

// Pagination logic
const totalPagesReservs = computed(() =>
  Math.ceil(reservations.value.length / perPageReservs.value)
);

const paginatedReservs = computed(() => {
  const start = (currentPageReservs.value - 1) * perPageReservs.value;
  const end = start + perPageReservs.value;
  return reservations.value.slice(start, end);
});

const handlePageChangeReservs = (page) => {
  currentPageReservs.value = page;
};

const fetchTodaySchedules = async () => {
  const endpoint = `reservations/barber/${userId}`;

  loading.value = true;
  try {
    const res = await api.get(endpoint, {
      params: {
        status: 'confirmed',
        date: selectedDate.value,
      },
    });
    reservations.value = res.data;
    console.log(reservations.value)
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Fetch barbers dengan query parameter
const fetchMyAttendance = async() => {
  loadingBarber.value = true;
  try {
    let endpoint = `/users/barber/presence/${userId}`;

    const res = await api.get(endpoint);
    barber.value = res.data;
    is_present.value = barber.value.is_present;
  } catch (err) {
    console.error("Error fetching barber:", err);
  } finally {
    loadingBarber.value = false;
  }
};

// Tandai barber sebagai hadir
const handlePresent = async (barberId) => {
  try {
    await api.patch(`/users/barbers/${barberId}/presence`, { 
      is_present: !is_present.value
    });
    
    if(is_present.value) {
      toast.success("Berhasil absensi tidak hadir")
    }else {
      toast.success("Berhasil absensi hadir")
    }
    // Refresh data setelah update
    await fetchMyAttendance();
  } catch (err) {
    console.error("Gagal update status:", err);
    alert("Gagal mengupdate status barber");
  }
};

const formatDateTime = (date, time) => {
  if (!date || !time) return "-"
  return dayjs(`${date}T${time}`).format('DD MMM YY, HH:mm')
};

onMounted(() => {
  fetchMyAttendance(),
  fetchTodaySchedules()
});
</script>