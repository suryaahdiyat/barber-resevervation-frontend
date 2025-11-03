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
      };
    },
  },
});
