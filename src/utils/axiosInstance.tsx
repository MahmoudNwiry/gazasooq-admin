import axios from 'axios';
import { useUserStore } from '../store/useStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
    const {userdata, isLoggedIn} = useUserStore.getState();
  if (isLoggedIn) {
    config.headers['authorization'] = `Bearer ${userdata?.token}`;
  }
  return config;
});

export default axiosInstance;
