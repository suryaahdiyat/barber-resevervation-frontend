<template>
  <div class="dark:bg-slate-950 bg-slate-100 min-h-screen w-full pb-20">
    <Navbar role="Barber" />
    <Sidebar
      role="barber"
    />
    <main class="dark:text-slate-100 text-slate-950">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";
</script>
