<template>
  <h1 class="text-black dark:text-slate-100">profile</h1>
  <button
      @click="toggleTheme"
      class="px-3 py-1 rounded border border-gray-400 dark:border-gray-600 text-sm text-gray-800 dark:text-gray-100"
    >
      {{ theme === 'dark' ? '☀️ Light' : '🌙 Dark' }}
    </button>
</template>


<script setup>
import { ref, onMounted } from 'vue'

const theme = ref('dark')

onMounted(() => {
  // Cek theme tersimpan di localStorage (biar gak reset setiap reload)
  const savedTheme = localStorage.getItem('theme') || 'light'
  theme.value = savedTheme
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
})

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
  localStorage.setItem('theme', theme.value)
}
</script>