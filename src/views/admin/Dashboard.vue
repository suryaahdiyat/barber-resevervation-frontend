<template>
  <div class="max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
    <!-- section absensi harian barber -->
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
          <div v-if="paginatedBarbers.length > 0">
            <table v-if="!loadingBarbers" class="dark:bg-slate-600 bg-slate-200 rounded-sm text-[8px] sm:text-[12px] overflow-hidden text-center max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
              <thead class="dark:bg-gray-700 bg-gray-600 text-slate-100 border-b-2 dark:border-slate-100 border-slate-800">
                <tr>
                  <th class="px-2 py-1">No</th>
                  <th class="px-2 py-1">Nama</th>
                  <th class="px-2 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(barber, index) in paginatedBarbers"
                  :key="barber.id"
                  class="border-b-2 dark:border-b-slate-200 border-b-slate-300"
                >
                  <td class="px-2 py-1 relative text-center">
                    {{ (currentPageBarbers - 1) * perPageBarbers + index + 1 }}
                  </td>
                  <td class="px-2 py-1">{{ barber.name }}</td>
                  <td class="px-2 py-1 text-center gap-1 md:gap-4 flex justify-center items-center">
                    <button 
                      @click="markAsPresent(barber.id)" 
                      title="Tandai Hadir" 
                      class="bg-red-500 hover:bg-rose-600 hover:cursor-pointer text-white px-3 py-1 rounded text-sm duration-75"
                    >
                      Off
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Pagination -->
            <Pagination
              :currentPage="currentPageBarbers"
              :totalPages="totalPagesBarbers"
              @change-page="handlePageChangeBarbers"
            />
          </div>
          <p v-else class="w-full text-slate-400 text-center py-4">
            {{ loadingBarbers ? 'Loading...' : 'Semua barber sudah absen hari ini! 🎉' }}
          </p>
        </details>
      </div>
      <div class="space-y-4 my-3">
        <details
          class="group border-s-4 border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 [&_summary::-webkit-details-marker]:hidden"
          open
        >
          <summary class="flex items-center justify-between gap-1.5 text-gray-900 dark:text-white">
            <h2 class="font-medium mb-2">Reservasi Baru</h2>   
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
                  <th class="px-2 py-1">Status</th>
                  <th class="px-2 py-1">Nama Layanan</th>
                  <th class="px-2 py-1">Aksi</th>
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
                  <td class="px-2 py-1">{{ r.status }}</td>
                  <td class="px-2 py-1">{{ r.service.name }}</td>
                  <td>
                    <button
                      @click="$router.push(`/admin/reservations/${r.id}/payment`)"
                      class="px-3 py-1 rounded text-sm underline hover:cursor-pointer duration-75 text-[8px] sm:text-[12px]"
                    >edit payment
                    </button>
                  </td>
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
            {{ loadingReservs ? 'Loading...' : 'Tidak ada reservasi yang belum di konfirmasi hari ini' }}
          </p>
        </details>
      </div>
      <div class="space-y-4 my-3">
        <details
          class="group border-s-4 border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 [&_summary::-webkit-details-marker]:hidden"
          open
        >
          <summary class="flex items-center justify-between gap-1.5 text-gray-900 dark:text-white">
            <h2 class="font-medium mb-2">Reservasi Need Review</h2>   
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
          <div v-if="paginatedReservs2.length > 0">
            <table v-if="!loadingReservs" class="dark:bg-slate-600 bg-slate-200 rounded-sm text-[8px] sm:text-[12px] overflow-hidden text-center max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
              <thead class="dark:bg-gray-700 bg-gray-600 text-slate-100 border-b-2 dark:border-slate-100 border-slate-800">
                <tr>
                  <th class="px-2 py-1">No</th>
                  <th class="px-2 py-1">Nama Cust</th>
                  <th class="px-2 py-1">Tanggal/ Jam</th>
                  <th class="px-2 py-1">Status</th>
                  <th class="px-2 py-1">Nama Layanan</th>
                  <th class="px-2 py-1">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(r, index) in paginatedReservs2"
                  :key="r.id"
                  class="border-b-2 dark:border-b-slate-200 border-b-slate-300"
                >
                  <td class="px-2 py-1 relative text-center">
                    {{ (currentPageReservs2 - 1) * perPageReservs2 + index + 1 }}
                  </td>
                  <td class="px-2 py-1">{{ r.customer?.name ? r.customer.name : "-" }}</td>
                  <td class="px-2 py-1">{{ formatDateTime(r.date, r.time)}}</td>
                  <td class="px-2 py-1">{{ r.status }}</td>
                  <td class="px-2 py-1">{{ r.service.name }}</td>
                  <td>
                    <button
                      @click="$router.push(`/admin/reservations/${r.id}/payment`)"
                      class="px-3 py-1 rounded text-sm underline hover:cursor-pointer duration-75 text-[8px] sm:text-[12px]"
                    >edit payment
                    </button>
                  </td>
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
            {{ loadingReservs ? 'Loading...' : 'Tidak ada reservasi yang belum di konfirmasi hari ini' }}
          </p>
        </details>
      </div>
      <!-- <div class="space-y-4">
        <details
          class="group border-s-4 border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 [&_summary::-webkit-details-marker]:hidden"
          open
        >
          <summary class="flex items-center justify-between gap-1.5 text-gray-900 dark:text-white">
            <h2 class="font-medium">Reservation</h2>
      
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
      
          <div class="text-gray-900 dark:text-white pt-3">
            <p class="flex justify-between w-1/3 pt-1"><span class="font-semibold w-1/2">Service Name</span></p>
            <p class="flex justify-between w-1/3 pt-1"><span class="font-semibold w-1/2">Status</span></p>
            <p class="flex justify-between w-1/3 pt-1"><span class="font-semibold w-1/2">Tanggal</span></p>
          </div>
        </details>
      </div> -->
      <!-- <div v-else class="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
        <dt class="font-medium text-gray-900 dark:text-white">Reservasi</dt>
  
        <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">Tidak ada data reservasi</dd>
      </div> -->
    </div>
    <!-- reset absensi manual -->
    <button @click="handleResetAttendance()" class="bg-cyan-600 text-white w-full mt-2 py-2 rounded hover:cursor-pointer duration-75">
      reset absensi manual
    </button>
    <button @click="handleDailyBarberCheck()" class="bg-cyan-600 text-white w-full mt-2 py-2 rounded hover:cursor-pointer duration-75">
      Cek ketersediaan barber manual
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Pagination from "../../components/Pagination.vue";
import api from "@/api/axios";
import dayjs from "dayjs";
import 'dayjs/locale/id';

const barbers = ref([]);
const loadingBarbers = ref(false);
const reservationsPending = ref([]);
const loadingReservs = ref(false);
const reservationsNeedReview = ref([]);
const loadingReservs2 = ref(false);
const selectedDate = ref(new Date().toISOString().split("T")[0]);

//for the pagination
const currentPageBarbers  = ref(1);
const perPageBarbers = ref(5);
const currentPageReservs  = ref(1);
const perPageReservs = ref(5);
const currentPageReservs2  = ref(1);
const perPageReservs2 = ref(5);

// Pagination logic
const totalPagesBarbers = computed(() =>
  Math.ceil(barbers.value.length / perPageBarbers.value)
);
// Pagination logic
const totalPagesReservs = computed(() =>
  Math.ceil(reservationsPending.value.length / perPageReservs.value)
);
const totalPagesReservs2 = computed(() =>
  Math.ceil(reservationsNeedReview.value.length / perPageReservs2.value)
);

const paginatedBarbers = computed(() => {
  const start = (currentPageBarbers.value - 1) * perPageBarbers.value;
  const end = start + perPageBarbers.value;
  return barbers.value.slice(start, end);
});

const paginatedReservs = computed(() => {
  const start = (currentPageReservs.value - 1) * perPageReservs.value;
  const end = start + perPageReservs.value;
  return reservationsPending.value.slice(start, end);
});

const paginatedReservs2 = computed(() => {
  const start = (currentPageReservs.value - 1) * perPageReservs2.value;
  const end = start + perPageReservs2.value;
  return reservationsNeedReview.value.slice(start, end);
});

const handlePageChangeBarbers = (page) => {
  currentPageBarbers.value = page;
};

const handlePageChangeReservs = (page) => {
  currentPageReservs.value = page;
};

const handlePageChangeReservs2 = (page) => {
  currentPageReservs2.value = page;
};

// Fetch barbers dengan query parameter
const fetchBarbers = async() => {
  loadingBarbers.value = true;
  try {
    let endpoint = '/users/barbers?is_present=false';

    const res = await api.get(endpoint);
    barbers.value = res.data;
    console.log("Data barber:", barbers.value);
  } catch (err) {
    console.error("Error fetching barbers:", err);
  } finally {
    loadingBarbers.value = false;
  }
};

// Fetch Reservs dengan query parameter
const fetchReservs = async() => {
  loadingReservs.value = true;
  try {
    // let endpoint = ';

    // const res = await api.get(`/reservationsPending`, {
    //   params: {
    //     status: "pending",
    //     date: selectedDate.value,
    //   },
    // });

    // Jalankan kedua query secara paralel untuk performance
    const [pendingRes, reviewRes] = await Promise.all([
      api.get(`/reservations`, {
        params: {
          status: "pending",
          date: selectedDate.value,
        },
      }),
      api.get(`/reservations`, {
        params: {
          status: "need_admin_review",
          date: selectedDate.value,
        },
      })
    ]);
    reservationsPending.value = pendingRes.data;
    reservationsNeedReview.value = reviewRes.data;
    console.log("pendingRes:", reservationsPending.value);
    console.log("pendingRes:", reservationsNeedReview.value);
    // console.log("Data reservasi:", reservationsPending.value);
    console.log("Pending:", reservationsPending.value.length, "Need Review:", reservationsNeedReview.value.length);
  } catch (err) {
    console.error("Error fetching reservationsPending:", err);
  } finally {
    loadingReservs.value = false;
  }
};

// Tandai barber sebagai hadir
const markAsPresent = async (barberId) => {
  try {
    await api.patch(`/users/barbers/${barberId}/presence`, { 
      is_present: true 
    });
    
    // Refresh data setelah update
    await fetchBarbers();
    
    console.log(`Barber ${barberId} ditandai hadir`);
  } catch (err) {
    console.error("Gagal update status:", err);
    alert("Gagal mengupdate status barber");
  }
};

const handleResetAttendance = async () => {
  try {
    await api.get('/admin/trigger-attendance-reset');
    
    // Refresh data setelah update
    await fetchBarbers();
  } catch (err) {
    console.error("Gagal gagal reset att:", err);
    alert("Gagal reset att");
  }
  console.log("all barber reset")
};

const handleDailyBarberCheck = async () => {
  try {
    await api.get('/admin/trigger-barber-check');
  } catch (err) {
    console.error("Gagal check barber:", err);
    alert("Gagal check barber");
  }
  console.log("all barber reset")
};

const formatDateTime = (date, time) => {
  if (!date || !time) return "-"
  return dayjs(`${date}T${time}`).format('DD MMM YY, HH:mm')
}

// Watch perubahan showAll untuk refresh data
// watch(fetchBarbers);

onMounted(() => {
  fetchBarbers(),
  fetchReservs()
});
</script>