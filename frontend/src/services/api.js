// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:4000/api", // ✅ Make sure this is correct
//   withCredentials: true, // for cookies/auth headers
// });

// export default API;
// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://up-waste-3clg.vercel.app/",
  withCredentials: true,
});

// Attach token before every request
API.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("upwaste-admin-token");
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

export default API;
