import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();
    const original = error.config;
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;
      const refreshed = await authStore.refresh();
      if (refreshed) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${authStore.token}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
