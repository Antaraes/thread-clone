import {storage} from '@/zustand/MMKV';
import axios from 'axios';

const API = axios.create({
  // baseURL: process.env.SERVER_PORT,
  baseURL: 'http://10.1.40.47:8080/api/v1',
  withCredentials: true,
  // baseURL: 'https://threads-clone-ten.vercel.app/api/v1',
});

API.interceptors.request.use(
  async config => {
    const data = storage.getString('token');

    if (data) {
      config.headers['Authorization'] = `Bearer ${data}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
API.interceptors.request.use(
  config => {
    const publicRoutes = ['/login'];

    if (publicRoutes.includes(config.url)) {
      delete config.headers['Authorization'];
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default API;
