import { defineStore } from "pinia";

export const useReservationStore = defineStore("reservation", {
  state: () => ({
    step: 1,
    reservation: {
      name: "",
      phone: "",
      email: "",
      service_id: null,
      barber_id: null,
      date: "",
      time: "",
      note: "",
      payment_method: "",
    },
  }),
  actions: {
    nextStep() {
      if (this.step < 4) this.step++;
    },
    prevStep() {
      if (this.step > 1) this.step--;
    },
    reset() {
      this.step = 1;
      this.reservation = {
        name: "",
        phone: "",
        email: "",
        service_id: null,
        barber_id: null,
        date: "",
        time: "",
        note: "",
        payment_method: "",
      };
    },
  },
});

export const useReservationStoreHelper = defineStore("reservationHelper", {
  state: () => ({
    reservationHelper: {
      service_name: "",
      service_desc: "",
      service_price: "",
      service_duration: "",
      service_picture: "",
      // barber_name: "",
    },
  }),
  actions: {
    reset() {
      this.reservationHelper = {
        service_name: "",
        service_desc: "",
        service_price: "",
        service_duration: "",
        service_picture: "",
        // barber_name: "",
      };
    },
  },
});
