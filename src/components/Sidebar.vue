<!-- src/components/Sidebar.vue -->
<template>
  <div
    class=""
  >

    <!-- Menu berdasarkan role -->
    <nav class="dark:bg-black lg:static bg-white text-slate-800 dark:text-slate-400 shadow pb-4 lg:py-4 flex justify-around items-center fixed bottom-0 right-0 left-0">
      <RouterLink
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="text-[10px] sm:text-[14px] tracking-wider rounded-full text-center px-2 py-3 duration-75"
        :class="{ 'dark:text-cyan-300 text-cyan-600 font-bold' : $route.path === item.path}"
      >
        <i :class="`bx ${item.icon} text-xl`"></i>

        <!-- <i :class="[
          'text-xl bx',
          $route.path === item.path ? `bxs-${item.icon}` : `bx-${item.icon}`
        ]"></i> -->
        <span class="hidden lg:block">
          {{ item.label }}
        </span>
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
        { label: "Dashboard", path: "/admin", icon: "bx-home-alt" },
        { label: "Reservations", path: "/admin/reservations", icon: "bx-calendar-check" },
        { label: "Services", path: "/admin/services", icon: "bx-cut" },
        { label: "Users", path: "/admin/users", icon: "bx-user" },
        { label: "Profile", path: "/admin/profile", icon: "bx-user-circle" },
      ];

      // return [
      //   { label: "Dashboard", path: "/admin" },
      //   { label: "Reservations", path: "/admin/reservations" },
      //   { label: "Services", path: "/admin/services" },
      //   { label: "Users", path: "/admin/users" },
      //   { label: "Profile", path: "/admin/profile" },
      // ];
    case "barber":
      return [
        { label: "Dashboard", path: "/barber" },
        { label: "My Schedule", path: "/barber/my-schedule" },
        { label: "Profile", path: "/barber/profile" },
      ];
    case "customer":
      return [
        { label: "Home", path: "/", icon: "bx-home-alt"},
        { label: "Make Reservation", path: "/reservation", icon: "bx-calendar-plus" },
        { label: "My Reservations", path: "/my-reservations", icon: "bx-bookmarks" },
        { label: "Profile", path: "/profile", icon: "bx-user-circle" },
      ];
    default:
      return [];
  }
});
</script>
