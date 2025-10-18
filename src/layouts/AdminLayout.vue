<!-- src/layouts/AdminLayout.vue -->
<template>
  <div class="bg-slate-950 h-screen w-full">
    <Navbar title="Admin Dashboard" />
    <main class="text-black">
      <router-view />
    </main>
    <Sidebar
      role="admin"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";

const sidebarOpen = ref(false);
const isDesktop = ref(window.innerWidth >= 768);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

onMounted(() => {
  window.addEventListener("resize", () => {
    isDesktop.value = window.innerWidth >= 768;
  });
});
</script>
