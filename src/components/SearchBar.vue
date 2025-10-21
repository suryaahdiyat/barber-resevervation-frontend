<template>
  <div class="max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto flex items-center gap-2">
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="placeholder"
      class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
      @keyup.enter="emitSearch"
    />
    <button
      @click="emitSearch"
      class="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
    >
      Cari
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props biar fleksibel (placeholder bisa disesuaikan di tiap halaman)
const props = defineProps({
  placeholder: {
    type: String,
    default: 'Cari data...',
  },
})

// Event emitter untuk mengirim hasil pencarian ke parent
const emit = defineEmits(['search'])

const searchQuery = ref('')

// Kirim nilai pencarian ke parent
const emitSearch = () => {
  emit('search', searchQuery.value.trim())
}
</script>
