import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050/api",
});

export const getCustomers = () => api.get("/users/customers");
export const getCustomerById = (id) => api.get(`/users/${id}`);
export const createCustomer = (data) => api.post("/users", data);
export const updateCustomer = (id, data) => api.put(`/users/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/users/${id}`);
