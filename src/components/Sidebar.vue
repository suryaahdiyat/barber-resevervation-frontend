<!-- <template>
  <div
    class=""
  >
    <nav class="dark:bg-black lg:static bg-white text-slate-800 dark:text-slate-400 shadow pb-4 lg:py-4 flex justify-around items-center fixed bottom-0 right-0 left-0">
      <RouterLink
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="text-[10px] sm:text-[14px] tracking-wider rounded-full text-center px-2 py-3 duration-75"
        :class="{ 'dark:text-cyan-300 text-cyan-600 font-bold' : $route.path === item.path}"
        >
        <i :class="`bx ${item.icon} text-xl`"></i>
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
    case "barber":
      return [
        { label: "Dashboard", path: "/barber", icon: "bx-home-alt" },
        { label: "My Schedule", path: "/barber/my-schedule", icon: "bx-bookmarks" },
        { label: "Profile", path: "/barber/profile", icon: "bx-user-circle" },
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
</script> -->

<!-- src/components/Sidebar.vue -->
<template>
  <div class="">
    <!-- Menu berdasarkan role -->
    <nav class="dark:bg-black lg:static bg-white text-slate-800 dark:text-slate-400 shadow pb-4 lg:py-4 flex justify-around items-center fixed bottom-0 right-0 left-0">
      <RouterLink
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="text-[10px] sm:text-[14px] tracking-wider rounded-full text-center px-2 py-3 duration-75"
        :class="{
          'dark:text-cyan-300 text-cyan-600 font-bold': isActive(item)
        }"
      >
        <i :class="`bx ${item.icon} text-xl`"></i>
        <span class="hidden lg:block">
          {{ item.label }}
        </span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  role: {
    type: String,
    required: true,
  },
});

// Tambahkan pattern matching untuk setiap menu
const menu = computed(() => {
  switch (props.role) {
    case "admin":
    case "cashier":
      return [
        { label: "Dashboard", path: "/admin", icon: "bx-home-alt", pattern: /^\/admin$/ },
        { label: "Reservations", path: "/admin/reservations", icon: "bx-calendar-check", pattern: /^\/admin\/reservations/ },
        { label: "Services", path: "/admin/services", icon: "bx-cut", pattern: /^\/admin\/services/ },
        { label: "Users", path: "/admin/users", icon: "bx-user", pattern: /^\/admin\/users/ },
        { label: "Profile", path: "/admin/profile", icon: "bx-user-circle", pattern: /^\/admin\/profile/ },
      ];
    case "barber":
      return [
        { label: "Dashboard", path: "/barber", icon: "bx-home-alt", pattern: /^\/barber$/ },
        { label: "My Schedule", path: "/barber/my-schedule", icon: "bx-bookmarks", pattern: /^\/barber\/my-schedule/ },
        { label: "Profile", path: "/barber/profile", icon: "bx-user-circle", pattern: /^\/barber\/profile/ },
      ];
    case "customer":
      return [
        // { label: "Home", path: "/", icon: "bx-home-alt", pattern: /^\/$/ },
        { label: "Make Reservation", path: "/reservation", icon: "bx-calendar-plus", pattern: /^\/reservation/ },
        { label: "My Reservations", path: "/my-reservations", icon: "bx-bookmarks", pattern: /^\/my-reservation/ }, // Perhatikan pattern-nya!
        { label: "Profile", path: "/profile", icon: "bx-user-circle", pattern: /^\/profile/ },
      ];
    default:
      return [];
  }
});

// Function untuk cek active dengan regex pattern
const isActive = (item) => {
  return item.pattern.test(route.path);
};
</script>