<!-- <template>
  <h1>Reservations form</h1>
</template> -->

<template>
  <div class="max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto py-6 px-2">
    <!-- Step Indicator -->
    <div class="flex justify-between mb-6">
      <div v-for="n in 4" :key="n"
        class="w-8 h-8 flex items-center justify-center rounded-full text-sm"
        :class="reservationStore.step >= n ? 'bg-cyan-600 text-white' : 'bg-gray-300 text-gray-600'">
        {{ n }}
      </div>
    </div>

    <!-- CONTENT -->
    <div v-if="reservationStore.step === 1">
      <StepSelectService />
    </div>
    <div v-else-if="reservationStore.step === 2">
      <StepSelectDateTime />
    </div>
    <div v-else-if="reservationStore.step === 3">
      <StepCustomerInfo />
    </div>
    <div v-else-if="reservationStore.step === 4">
      <StepReviewSubmit />
    </div>
  </div>
</template>

<script setup>
import { useReservationStore } from "@/stores/useReservationStore";
import StepSelectService from "./make-reservation-steps/StepSelectService.vue";
import StepSelectDateTime from "./make-reservation-steps/StepSelectDateTime.vue";
import StepCustomerInfo from "./make-reservation-steps/StepCustomerInfo.vue";
import StepReviewSubmit from "./make-reservation-steps/StepReviewSubmit.vue";

const reservationStore = useReservationStore();
</script>
