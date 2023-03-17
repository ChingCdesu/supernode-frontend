import axios from "axios";

const request = axios.create({
  timeout: 5000,
});

request.interceptors.request.use((config) => {
  return config;
});

request.interceptors.response.use((response) => {
  return response.data;
});
