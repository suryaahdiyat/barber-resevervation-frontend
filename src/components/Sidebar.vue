<!-- src/components/Sidebar.vue -->
<template>
  <div
    class=""
  >

    <!-- Menu berdasarkan role -->
    <nav class="dark:bg-black lg:static bg-white text-slate-800 dark:text-slate-400 shadow py-4 sm:py-6 lg:py-4 flex justify-around items-center fixed bottom-0 right-0 left-0">
      <RouterLink
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="text-[10px] sm:text-[14px] tracking-wider border-b-2 border-b-transparent dark:hover:border-b-slate-100 hover:border-slate-950 duration-75"
        :class="{ 'dark:text-slate-100 text-slate-950 font-bold' : $route.path === item.path}"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  role: {
    type: String,
    required: true,
  },
});

const menu = computed(() => {
  switch (props.role) {
    case "admin":
    case "cashier":
      return [
        { label: "Dashboard", path: "/admin" },
        { label: "Reservations", path: "/admin/reservations" },
        { label: "Services", path: "/admin/services" },
        { label: "Users", path: "/admin/users" },
        { label: "Profile", path: "/admin/profile" },
      ];
    case "barber":
      return [
        { label: "Dashboard", path: "/barber" },
        { label: "My Schedule", path: "/barber/my-schedule" },
        { label: "Profile", path: "/barber/profile" },
      ];
    case "customer":
      return [
        { label: "Home", path: "/" },
        { label: "Make Reservation", path: "/reservation" },
        { label: "My Reservations", path: "/my-reservations" },
        { label: "Profile", path: "/profile" },
      ];
    default:
      return [];
  }
});
</script>
