import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.65:5050/api", // ganti sesuai backend kamu
});

// Tambahkan interceptor untuk debug
// api.interceptors.request.use((config) => {
//   console.log("Making request to:", config.url);
//   console.log("Full URL:", config.baseURL + config.url);
//   return config;
// });

export default api;
