import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AxiosInstance = async (contentType = 'application/json') => {
  const token = await AsyncStorage.getItem('token');

  const axiosInstance = axios.create({
    baseURL: 'https://pro2052-restaurant-api.onrender.com/',
  });

  axiosInstance.interceptors.request.use(
    async config => {
      config.headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': contentType,
      };

      // Check if data is an instance of FormData
      if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      }

      return config;
    },
    err => Promise.reject(err),
  );

  axiosInstance.interceptors.response.use(
    res => res.data,
    err => Promise.reject(err),
  );
  return axiosInstance;
};

export default AxiosInstance;
