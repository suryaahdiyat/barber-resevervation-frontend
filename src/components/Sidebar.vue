<!-- src/components/Sidebar.vue -->
<template>
  <div
    class=""
  >

    <!-- Menu berdasarkan role -->
    <nav class="bg-black text-slate-400 shadow py-6 flex justify-around items-center absolute bottom-0 right-0 left-0">
      <RouterLink
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="text-[14px] tracking-wider border-b-2 border-b-transparent hover:border-b-slate-100 duration-75"
        :class="{ 'text-slate-100 font-bold' : $route.path === item.path}"
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
        { label: "Payments", path: "/admin/payments" },
        { label: "Users", path: "/admin/users" },
        { label: "Profile", path: "/admin/profile" },
      ];
    case "barber":
      return [
        { label: "Dashboard", path: "/barber" },
        { label: "My Schedule", path: "/barber/my-schedule" },
      ];
    case "customer":
      return [
        { label: "Home", path: "/" },
        { label: "Make Reservation", path: "/reservation" },
        { label: "My Reservations", path: "/my-reservations" },
      ];
    default:
      return [];
  }
});
</script>
