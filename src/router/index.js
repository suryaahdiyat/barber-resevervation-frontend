import { createRouter, createWebHistory } from "vue-router";
import Profile from "@/views/pages/Profile.vue";

// Layouts
import AdminLayout from "@/layouts/AdminLayout.vue";
import BarberLayout from "@/layouts/BarberLayout.vue";
import CustomerLayout from "@/layouts/CustomerLayout.vue";

// Views
import AdminDashboard from "@/views/admin/Dashboard.vue";
import AdminReservations from "@/views/admin/Reservations.vue";
import AdminServices from "@/views/admin/Services.vue";
import AdminUsers from "@/views/admin/Users.vue";

import BarberDashboard from "@/views/barber/Dashboard.vue";
import BarberSchedule from "@/views/barber/MySchedule.vue";

import CustomerHome from "@/views/customer/Home.vue";
import CustomerReservation from "@/views/customer/ReservationForm.vue";
import CustomerMyReservations from "@/views/customer/MyReservations.vue";

const routes = [
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      { path: "", component: AdminDashboard },
      { path: "reservations", component: AdminReservations },
      { path: "services", component: AdminServices },
      { path: "users", component: AdminUsers },
      { path: "profile", component: Profile },
    ],
  },
  {
    path: "/barber",
    component: BarberLayout,
    children: [
      { path: "", component: BarberDashboard },
      { path: "my-schedule", component: BarberSchedule },
      { path: "profile", component: Profile },
    ],
  },
  {
    path: "/",
    component: CustomerLayout,
    children: [
      { path: "", component: CustomerHome },
      { path: "reservation", component: CustomerReservation },
      { path: "my-reservations", component: CustomerMyReservations },
      { path: "profile", component: Profile },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
