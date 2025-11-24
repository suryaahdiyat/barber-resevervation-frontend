<template>
  <div class="max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
    <!-- section absensi harian barber -->
    <div>
      <h1 class="my-2 text-xl font-semibold dark:text-slate-100 text-slate-950">Absensi Barber Hari Ini</h1>
      <div v-if="paginatedBarbers.length > 0">
        <table v-if="!loading" class="dark:bg-slate-600 bg-slate-200 rounded-sm text-[8px] sm:text-[12px] overflow-hidden text-center max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto">
          <thead class="dark:bg-gray-700 bg-gray-600 text-slate-100 border-b-2 dark:border-slate-100 border-slate-800">
            <tr>
              <th class="px-2 py-1">No</th>
              <th class="px-2 py-1">Nama</th>
              <!-- <th class="px-2 py-1">Status</th> -->
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
                {{ (currentPage - 1) * perPage + index + 1 }}
              </td>
              <td class="px-2 py-1">{{ barber.name }}</td>
              <!-- <td class="px-2 py-1">
                <span class="px-2 py-1 rounded text-white" :class="barber.is_present ? 'bg-green-500' : 'bg-red-500'">
                  {{ barber.is_present ? 'Hadir' : 'Tidak Hadir' }}
                </span>
              </td> -->
              <td class="px-2 py-1 text-center gap-1 md:gap-4 flex justify-center items-center">
                <!-- <button 
                  v-if="!barber.is_present"
                  @click="markAsPresent(barber.id)" 
                  title="Tandai Hadir" 
                  class="bg-green-500 hover:bg-emerald-600 text-white px-3 py-1 rounded text-sm duration-75"
                >
                  Hadir
                </button>
                <button 
                  v-else
                  @click="markAsAbsent(barber.id)" 
                  title="Tandai Tidak Hadir" 
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm duration-75"
                >
                  Tidak Hadir
                </button> -->
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
          :currentPage="currentPage"
          :totalPages="totalPages"
          @change-page="handlePageChange"
        />
      </div>
      <p v-else class="w-full text-slate-400 text-center py-4">
        {{ loading ? 'Loading...' : 'Semua barber sudah absen hari ini! 🎉' }}
      </p>
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

const barbers = ref([]);
const loading = ref(false);
const showAll = ref(false); // Toggle untuk tampilkan semua atau hanya belum absen

//for the pagination
const currentPage = ref(1);
const perPage = ref(5);

// Pagination logic
const totalPages = computed(() =>
  Math.ceil(barbers.value.length / perPage.value)
);

const paginatedBarbers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return barbers.value.slice(start, end);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

// Fetch barbers dengan query parameter
const fetchBarbers = async() => {
  loading.value = true;
  try {
    let endpoint = '/users/barbers';
    
    // Gunakan query parameter berdasarkan showAll
    if (!showAll.value) {
      endpoint += '?is_present=false'; // Hanya yang belum absen
    }
    
    const res = await api.get(endpoint);
    barbers.value = res.data;
    console.log("Data barber:", barbers.value);
  } catch (err) {
    console.error("Error fetching barbers:", err);
  } finally {
    loading.value = false;
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

// Tandai barber sebagai tidak hadir
// const markAsAbsent = async (barberId) => {
//   try {
//     await api.patch(`/users/barbers/${barberId}/presence`, { 
//       is_present: false 
//     });
    
//     // Refresh data setelah update
//     await fetchBarbers();
    
//     console.log(`Barber ${barberId} ditandai tidak hadir`);
//   } catch (err) {
//     console.error("Gagal update status:", err);
//     alert("Gagal mengupdate status barber");
//   }
// };

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

// Watch perubahan showAll untuk refresh data
watch(showAll, () => {
  currentPage.value = 1; // Reset ke page 1 saat ganti filter
  fetchBarbers();
});

onMounted(fetchBarbers);
</script>