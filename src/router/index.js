import { createRouter, createWebHistory } from "vue-router";

// Layouts
import AdminLayout from "@/layouts/AdminLayout.vue";
import BarberLayout from "@/layouts/BarberLayout.vue";
import CustomerLayout from "@/layouts/CustomerLayout.vue";

// Views
import AdminDashboard from "@/views/admin/Dashboard.vue";
import AdminReservations from "@/views/admin/Reservations.vue";
import AdminPayments from "@/views/admin/Payments.vue";
import AdminUsers from "@/views/admin/Users.vue";
import AdminProfile from "@/views/admin/Profile.vue";

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
      { path: "payments", component: AdminPayments },
      { path: "users", component: AdminUsers },
      { path: "profile", component: AdminProfile },
    ],
  },
  {
    path: "/barber",
    component: BarberLayout,
    children: [
      { path: "", component: BarberDashboard },
      { path: "my-schedule", component: BarberSchedule },
    ],
  },
  {
    path: "/",
    component: CustomerLayout,
    children: [
      { path: "", component: CustomerHome },
      { path: "reservation", component: CustomerReservation },
      { path: "my-reservations", component: CustomerMyReservations },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
