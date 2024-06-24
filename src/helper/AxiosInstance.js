
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AxiosInstance = (contentType = 'application/json') => {
    const axiosInstance = axios.create({
        baseURL: 'https://pro2052-restaurant-api.onrender.com/' 
        
    });

    axiosInstance.interceptors.request.use(
        async (config) => {
          config.headers = {
            Authorization: `Bearer ${''}`,
            Accept: 'application/json',
            'Content-Type': contentType,
          };
          return config;
        },
        err => Promise.reject(err),
      );
//     axiosInstance.interceptors.request.use(
//       async (config) => {
//           const token = await AsyncStorage.getItem('token');
//           if (!token) {
//             throw new Error('Token không tồn tại hoặc hết hạn');
//           }
//           config.headers = {
//               'Authorization': `Bearer ${token}`,
//               'Accept': 'application/json',
//               'Content-Type': contentType
//           }
//           return config;
//       },
//       err => Promise.reject(err)
//   );

    
      axiosInstance.interceptors.response.use(
        res => res.data,
        err => Promise.reject(err),
      );
      return axiosInstance;
    };

export default AxiosInstance;
