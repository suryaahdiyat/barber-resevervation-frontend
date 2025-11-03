<!-- src/components/Navbar.vue -->
<template>
  <nav
    class="dark:bg-black bg-white text-slate-950 dark:text-slate-100 shadow lg:shadow-none px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-30"
  >

    <!-- Judul halaman -->
    <h1 class="text-lg font-semibold font-display tracking-wider dark:text-cyan-300 text-cyan-600">MyBarber</h1>

    <!-- Profil -->
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
</script>
