<!-- src/layouts/AdminLayout.vue -->
<template>
  <div class="dark:bg-slate-950 bg-slate-100 min-h-screen w-full pb-20">
    <Navbar role="Admin" />
    <Sidebar
      role="admin"
    />
    <main class="dark:text-slate-100 text-slate-950">
      <router-view />
    </main>
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
