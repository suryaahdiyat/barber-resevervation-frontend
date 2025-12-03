<template>
  <div class="p-2 space-y-2 mx-auto md:max-w-2xl lg:max-w-4xl">
    <button @click="goToMyAccount" class="py-4 rounded-md w-full bg-white dark:bg-slate-800 hover:cursor-pointer duration-75 shadow">
      Akun Saya
    </button>
    <div class="py-4 flex justify-center items-center gap-3 rounded-md w-full bg-white dark:bg-slate-800 duration-75 shadow">
      <p>Ganti Tema</p>
      <button
        @click="toggleTheme"
        class="px-3 py-1 rounded-2xl border border-gray-400 dark:border-gray-600 text-sm text-gray-800 dark:text-gray-100 hover:cursor-pointer duration-75"
      >
        {{ theme === 'dark' ? '☀️ Light' : '🌙 Dark' }}
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

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

const basePrefix = computed(() => {
  const first = route.path.split("/")[1];

  // Kalau sedang di customer profile => prefix menjadi ""
  if (first === "profile") return "";

  // Kalau admin => "/admin", kalau barber => "/barber"
  return first ? `/${first}` : "";
});

const goToMyAccount = () => {
  router.push(`${basePrefix.value}/profile/my-account`);
};
</script>