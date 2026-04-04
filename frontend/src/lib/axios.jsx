import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
export const axiosInstance = axios.create({
  baseURL: backendUrl,
});