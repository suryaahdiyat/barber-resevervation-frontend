<!-- <template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-100">
    <Sidebar
      role="barber"
      v-show="sidebarOpen || isDesktop"
      @close="sidebarOpen = false"
    />

    <div class="flex-1 flex flex-col">
      <Navbar title="Barber Panel" @toggleSidebar="toggleSidebar" />
      <main class="flex-1 p-4 md:p-6 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template> -->

<template>
  <div class="bg-slate-300 h-screen w-full">
    <Navbar />
    <main class="text-black">
      <router-view />
    </main>
    <Sidebar
      role="barber"
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
