import axios from "axios";

// const api = axios.create({
//   baseURL: "http://192.168.1.65:5050/api",
// });

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    `http://${window.location.hostname}:5050/api`,
});

export default api;
