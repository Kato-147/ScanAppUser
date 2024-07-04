import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import AxiosInstance from '../../helper/AxiosInstance';

// Login 
export const login = async (email, password) => {
  console.log(email, password);
  try {
    const url = 'v1/users/login';
    const body = {email, password};
    const axiosInstance = await AxiosInstance(); // Đợi instance
    const res = await axiosInstance.post(url, body);

    return res;
    
  } catch (err) {
    if (err.response) {
      console.log('API error:', err.response);
      throw new Error(err.response.message || 'Đăng nhập thất bại');
    } else if (err.request) {
      console.log('No response from API:', err.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', err.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

// Register
 export const register = async (fullName, email, password) => {
  console.log(fullName, email, password);
  try {
    const url = 'v1/users/register'; // Đường dẫn endpoint
    const body = {fullName, email, password}; // Dữ liệu gửi đi
    const axiosInstance = await AxiosInstance(); // Đợi instance
    const res = await axiosInstance.post(url, body); // Gửi yêu cầu
    return res; // Trả về dữ liệu phản hồi
  } catch (err) {
    // Xử lý lỗi chi tiết
    if (err.response) {
      console.log('API error:', err.response);
      throw new Error(err.response.message || 'Đăng ký thất bại');
    } else if (err.request) {
      console.log('No response from API:', err.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', err.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};


// Send Otp code
export const verifyOtp = async (email, verificationCode) => {
  try {
    const url = 'v1/users/verify';
    const body = {email, verificationCode};
    const axiosInstance = await AxiosInstance(); // Đợi instance
    const res = await axiosInstance.post(url, body);
    return res;
  } catch (err) {
    // Xử lý lỗi chi tiết
    if (err.response) {
      console.log('API error:', err.response);
      throw new Error(err.response.message || 'xác thực thất bại');
    } else if (err.request) {
      console.log('No response from API:', err.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', err.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

//Update Info User
export const updateUser = async (formData) => {
  console.log('>>>>truyền dô ảnh và tên',formData);
  try {
    const url = 'v1/users/update-me'; // Đường dẫn endpoint
   // const body = {formData}; // Dữ liệu gửi đi
    const axiosInstance = await AxiosInstance('multipart/form-data'); // Đợi instance
    const res = await axiosInstance.patch(url, formData); // Gửi yêu cầu
    return res; // Trả về dữ liệu phản hồi
    
  } catch (err) {
    // Xử lý lỗi chi tiết
    if (err.response) {
      if (err.response) {
        console.error('API error:', err.response.data);
        throw new Error(err.response.data.message || 'Cập nhật thông tin người dùng thất bại');
      } else if (err.request) {
        console.error('No response from API:', err.request);
        throw new Error('Không có phản hồi từ máy chủ');
      } else {
        console.error('Error setting up request:', err.message);
        throw new Error('Lỗi khi thiết lập yêu cầu');
      }
    }
  }
};

// Login 
export const updatePassword = async (currentPassword, newPassword) => {
  console.log(currentPassword, newPassword);
  try {
    const url = 'v1/users/update-password';
    const body = {currentPassword, newPassword};
    const axiosInstance = await AxiosInstance(); // Đợi instance
    const res = await axiosInstance.patch(url, body);

    return res;
    
  } catch (err) {
    if (err.response) {
      console.log('API error:', err.response);
      throw new Error(err.response.message || 'Cập nhật mật khẩu thất bại');
    } else if (err.request) {
      console.log('No response from API:', err.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', err.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

