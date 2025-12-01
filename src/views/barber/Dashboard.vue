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
const is_present = ref(false);

// Fetch barbers dengan query parameter
const fetchMyAttendance = async() => {
  const userId = 3; // ganti dengan user ID nanti
  loadingBarber.value = true;
  try {
    let endpoint = `/users/barber/presence/${userId}`;

    const res = await api.get(endpoint);
    barber.value = res.data;
    is_present.value = barber.value.is_present;
    // console.log("Data barber:", barber.value);
    // toast.success("Berhasil absensi hadir")
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

onMounted(fetchMyAttendance);
</script>