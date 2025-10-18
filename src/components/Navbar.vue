<!-- src/components/Navbar.vue -->
<template>
  <nav
    class="bg-black text-slate-100 shadow px-4 py-3 flex items-center justify-between sticky top-0 z-30"
  >

    <!-- Judul halaman -->
    <h1 class="text-lg font-semibold font-display tracking-wider text-cyan-600">MyBarber</h1>

    <!-- Profil -->
    <div class="flex items-center space-x-3">
      <img
        src="https://ui-avatars.com/api/?name=admin"
        alt="avatar"
        class="w-8 h-8 rounded-full"
      />
      <span class="text-sm hidden sm:block">admin</span>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "Dashboard",
  },
});
</script>
