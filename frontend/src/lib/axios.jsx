import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
const finalUrl = backendUrl.endsWith('/') ? backendUrl : `${backendUrl}/`;

export const axiosInstance = axios.create({
  baseURL: finalUrl,
});

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};