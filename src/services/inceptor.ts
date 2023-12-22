import {storage} from '@/zustand/MMKV';
import axios from 'axios';

const API = axios.create({
  // baseURL: process.env.SERVER_PORT,
  baseURL: 'http://10.1.40.193:8080/api/v1',
  withCredentials: true,
  // baseURL: 'http://localhost:8080/api/v1',
  // baseURL: 'https://threads-clone-ten.vercel.app/api/v1',
});

API.interceptors.request.use(
  async config => {
    const data = JSON.parse(storage.getString('user'));

    if (data && data.accessToken) {
      config.headers['Authorization'] = `Bearer ${data.accessToken}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
API.interceptors.request.use(
  config => {
    const publicRoutes = ['/login', '/create-post'];

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
