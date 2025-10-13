import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050/api",
});

export const getCustomers = () => api.get("/customers");
export const getCustomerById = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post("/customers", data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);
