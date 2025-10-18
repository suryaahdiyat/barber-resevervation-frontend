import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050/api", // ganti sesuai backend kamu
});

export default api;
