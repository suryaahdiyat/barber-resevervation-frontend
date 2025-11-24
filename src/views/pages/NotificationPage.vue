<!-- views/NotificationsPage.vue -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">Your recent notifications</p>
      </div>

      <!-- Notifications List -->
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <!-- Empty State -->
        <div v-if="notifications.length === 0" class="text-center py-12">
          <i class='bx bx-bell-off text-5xl text-gray-400 mb-4'></i>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications</h3>
          <p class="text-gray-500 dark:text-gray-400">You're all caught up!</p>
        </div>

        <!-- Notifications -->
        <div v-else>
          <div 
            v-for="notif in notifications" 
            :key="notif.id"
            class="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
          >
            <div 
              class="p-6 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              :class="{ 'bg-blue-50 dark:bg-blue-900/20': !notif.is_read }"
              @click="markAsRead(notif)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white text-lg">
                      {{ notif.title }}
                    </h3>
                    <span 
                      v-if="!notif.is_read"
                      class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      New
                    </span>
                  </div>
                  <p class="text-gray-600 dark:text-gray-300 mb-2">{{ notif.message }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(notif.created_at) }}
                  </p>
                </div>
                <button 
                  @click.stop="deleteNotification(notif.id)"
                  class="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <i class='bx bx-trash text-xl'></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore && notifications.length > 0" class="mt-6 text-center">
        <button 
          @click="loadMore"
          :disabled="loading"
          class="px-6 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Loading...' : 'Load More' }}
        </button>
      </div>

      <!-- No More Notifications -->
      <div v-if="!hasMore && notifications.length > 0" class="mt-6 text-center">
        <p class="text-gray-500 dark:text-gray-400">No more notifications</p>
      </div>
      <!-- <div v-if="notifications.length > 0" class="mt-6 text-center">
        <button 
          @click="loadMore"
          class="px-6 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          Load More
        </button>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from "@/api/axios";

// import { useRoute } from 'vue-router'

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});

const notifications = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const hasMore = ref(true)


// Mock data (sama dengan navbar)
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
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    title: "Payment Received",
    message: "Your payment for reservation #123 has been processed successfully", 
    is_read: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

// Fetch notifications
const fetchNotifications = async (page = 1) => {
  if (loading.value) return
  
  loading.value = true
  try {
    const res = await api.get(`/notifications/paginated`, {
      params: {
        user_id: props.userId,
        page: page,
        limit: 10
      }
    })
    
    if (page === 1) {
      // Reset untuk page pertama
      notifications.value = res.data.notifications
    } else {
      // Append untuk load more
      notifications.value = [...notifications.value, ...res.data.notifications]
    }
    
    totalPages.value = res.data.pagination.total_pages
    currentPage.value = res.data.pagination.current_page
    hasMore.value = currentPage.value < totalPages.value
    
  } catch (err) {
    console.error('Failed to fetch notifications:', err)
    // Fallback ke mock data jika error
    if (notifications.value.length === 0) {
      notifications.value = mockNotifications
    }
  } finally {
    loading.value = false
  }
}

// const fetchNotifications = async () => {
//   try {
//     // const userId = 1;
//     // TODO: Ganti dengan API real
//     // const res = await api.get(`/notifications?user_id=${props.userId}`)
//     const res = await api.get(`/notifications/paginated?user_id=${props.userId}`)
//     notifications.value = res.data.notifications
//     console.log(notifications.value);
//     // notifications.value = mockNotifications
//   } catch (err) {
//     console.error('Failed to fetch notifications:', err)
//     notifications.value = mockNotifications
//   }
// }

// Mark as read
const markAsRead = async (notification) => {
  try {
    // TODO: Ganti dengan API real
    await api.patch(`/notifications/${notification.id}/read`)
    
    notification.is_read = true
  } catch (err) {
    console.error('Failed to mark as read:', err)
  }
}

// Delete notification
const deleteNotification = async (id) => {
  try {
    // TODO: Ganti dengan API real  
    await api.delete(`/notifications/${id}`)
    
    notifications.value = notifications.value.filter(n => n.id !== id)
    console.log('Notification deleted:', id)
  } catch (err) {
    console.error('Failed to delete notification:', err)
  }
}

// Load more notifications
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    fetchNotifications(currentPage.value + 1)
  }
}
// const loadMore = () => {
//   // TODO: Implement pagination nanti
//   console.log('Load more notifications...')
// }

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
};

onMounted(() => {
  fetchNotifications()
});
</script>