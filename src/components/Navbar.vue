<!-- <template>
  <nav
    class="dark:bg-black bg-white text-slate-950 dark:text-slate-100 shadow lg:shadow-none px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-30"
  >
    <h1 class="text-lg font-semibold font-display tracking-wider dark:text-cyan-300 text-cyan-600">MyBarber</h1>
    <div class="flex items-center space-x-3">
      <img
        :src="`https://ui-avatars.com/api/?name=${role}`"
        alt="avatar"
        class="w-8 h-8 rounded-full"
      />
      <span class="text-sm hidden sm:block">{{role}}</span>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  role: {
    type: String,
    default: "Customer",
  },
});
</script> -->

<template>
  <nav
    class="dark:bg-black bg-white text-slate-950 dark:text-slate-100 shadow lg:shadow-none px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-30"
  >
    <!-- Judul halaman -->
    <h1 class="text-lg font-semibold font-display tracking-wider dark:text-cyan-300 text-cyan-600">MyBarber</h1>

    <!-- Right Section -->
    <div class="flex items-center space-x-4">
      <!-- Notification Bell -->
      <div class="relative">
        <button 
          @click="toggleNotifications"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative"
        >
          <i class='bx bx-bell text-xl'></i>
          <!-- Red dot indicator -->
          <span 
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
          >
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </button>

        <!-- Notification Dropdown -->
        <div 
          v-if="showNotifications"
          class="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
        >
          <!-- Header -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 class="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            <button 
              @click="markAllAsRead"
              class="text-sm text-blue-500 hover:text-blue-600 duration-75 hover:cursor-pointer"
              v-if="unreadCount > 0"
            >
              Mark all read
            </button>
          </div>
          
          <!-- Empty State -->
          <div v-if="notifications.length === 0" class="p-8 text-center text-gray-500">
            <i class='bx bx-bell-off text-3xl mb-2'></i>
            <p>No notifications yet</p>
          </div>

          <!-- Notifications List -->
          <div v-else>
            <div 
              v-for="notif in notifications" 
              :key="notif.id"
              class="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              :class="{ 'bg-blue-50 dark:bg-blue-900/20': !notif.is_read }"
              @click="handleNotificationClick(notif)"
            >
              <div class="flex justify-between items-start mb-1">
                <p class="font-medium text-sm text-gray-900 dark:text-white">{{ notif.title }}</p>
                <span class="text-xs text-gray-500 whitespace-nowrap">{{ formatTime(notif.created_at) }}</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{{ notif.message }}</p>
              <div 
                v-if="!notif.is_read"
                class="w-2 h-2 bg-blue-500 rounded-full mt-2"
              ></div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
            <!-- here is the base the user role and id later on -->
            <!-- down here -->
            <button 
              @click="$router.push(`/notifications/${userId}`)" 
              class="text-sm text-blue-500 hover:text-blue-600 duration-75 hover:cursor-pointer"
            >
              View All
            </button>
          </div>
        </div>
      </div>

      <!-- Profil -->
      <div class="flex items-center space-x-3">
        <img
          :src="`https://ui-avatars.com/api/?name=${role}`"
          alt="avatar"
          class="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
        />
        <span class="text-sm hidden sm:block">{{ role }}</span>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import api from "@/api/axios";
import { useRouter } from "vue-router";

const router = useRouter()

const props = defineProps({
  role: {
    type: String,
    default: "Customer",
  },
  userId: {
    type: String,
    default: "3"
  }
})

// Notification state
const showNotifications = ref(false)
const notifications = ref([])
const unreadCount = ref(0)

// Mock data untuk testing (nanti ganti dengan API real)
const mockNotifications = [
  {
    id: 1,
    title: "Reservation Confirmed",
    message: "Your reservation with Barber Budi has been confirmed for today at 14:00",
    is_read: false,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "New Service Available",
    message: "Check out our new haircut service with special discount",
    is_read: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: 3,
    title: "Payment Received",
    message: "Your payment for reservation #123 has been processed successfully",
    is_read: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  }
]

// Fetch notifications (sementara pakai mock data)
const fetchNotifications = async () => {
  try {
    // TODO: Ganti dengan API real nanti
    const res = await api.get(`/notifications?user_id=${props.userId}`);
    notifications.value = res.data;
    
    // notifications.value = mockNotifications
    unreadCount.value = notifications.value.filter(n => !n.is_read).length
    // console.log(unreadCount.value)
    if(unreadCount.value == 0){
      // console.log("show just 3 latest notifications");
      // Ambil 3 notifikasi terbaru
      notifications.value = notifications.value
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);
    } else {
      // console.log("show all latest unread notifications")
      notifications.value = notifications.value
        .filter(n => !n.is_read)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    // console.log('Notifications loaded:', notifications.value.length)
    // console.log('Notifications loaded:', notifications.value);
  } catch (err) {
    console.error('Failed to fetch notifications:', err)
    // Fallback ke mock data jika error
    notifications.value = mockNotifications
    unreadCount.value = notifications.value.filter(n => !n.is_read).length
  }
}

// Toggle notification dropdown
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    fetchNotifications()
  }
}

// Handle notification click
const handleNotificationClick = (notification) => {
  // console.log('Notification clicked:', notification)
  
  // Mark as read jika belum dibaca
  if (!notification.is_read) {
    markAsRead(notification)
  }
  
  // TODO: Handle navigation berdasarkan type notifikasi
  // if (notification.related_entity === 'reservation') {
  router.push(`${notification.action_url}`)
  // }
  
  // Tutup dropdown setelah klik
  showNotifications.value = false
}

// Mark single notification as read
const markAsRead = async (notification) => {
  try {
    // TODO: Ganti dengan API real nanti
    await api.patch(`/notifications/${notification.id}/read`)
    
    notification.is_read = true
    unreadCount.value = Math.max(0, unreadCount.value - 1)
    console.log('Marked as read:', notification.id)
  } catch (err) {
    console.error('Failed to mark as read:', err)
  }
}

// Mark all as read
const markAllAsRead = async () => {
  try {
    // TODO: Ganti dengan API real nanti
    const res = await api.patch(`/notifications/mark-all-read`, {
      user_id: props.userId
    });

    console.log(res.data);
    
    notifications.value.forEach(notif => {
      notif.is_read = true
    });
    unreadCount.value = 0;
    console.log('All notifications marked as read');
  } catch (err) {
    console.error('Failed to mark all as read:', err);
  }
}

// Format waktu
const formatTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short' 
  })
}

// Close dropdown ketika klik di luar
const handleClickOutside = (event) => {
  const notificationElement = event.target.closest('.relative')
  if (!notificationElement) {
    showNotifications.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Load initial notifications count
  fetchNotifications()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
});
</script>

<style scoped>
  .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>