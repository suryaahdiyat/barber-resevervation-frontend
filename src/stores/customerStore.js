import { defineStore } from "pinia";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customerService";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customers: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCustomers() {
      this.loading = true;
      try {
        const res = await getCustomers();
        // console.log(res);
        await new Promise((resolve) => setTimeout(resolve, 800)); // simulasi delay 0.8 detik
        this.customers = res.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async addCustomer(data) {
      this.loading = true;
      try {
        await createCustomer(data);
        await this.fetchCustomers();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async editCustomer(id, data) {
      this.loading = true;
      try {
        await updateCustomer(id, data);
        await this.fetchCustomers();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async removeCustomer(id) {
      await deleteCustomer(id);
      await this.fetchCustomers();
    },
  },
});
