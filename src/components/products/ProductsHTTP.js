import AsyncStorage from '@react-native-async-storage/async-storage';
import AxiosInstance from '../../helper/AxiosInstance';
import axios from 'axios';
import { ToastAndroid } from 'react-native';

// infor user profile
export const infoProfile = async () => {
  try {
    const url = 'v1/users/me'; // Endpoint API
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.get(url); // GET request không cần body
    // console.log('--------------HTTP Get Info User',res.data.user._id);
    await AsyncStorage.setItem('userID', res.data.user._id);
    return res; // Trả về dữ liệu từ API
  } catch (err) {
    if (err.response) {
      console.log('API error:', err.response);
      throw new Error(err.response.message || 'Lấy thông tin user thất bại');
    } else if (err.request) {
      console.log('No response from API:', err.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', err.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

// get categories
export const getCategories = async () => {
  try {
    const url = `v1/categories`; // Endpoint API để lấy tất cả các danh mục
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.get(url); // Yêu cầu GET để lấy tất cả các danh mục
    // console.log(res.data,'===============API CATEGOKU============');
    return res.data; // Trả về dữ liệu từ API
  } catch (err) {
    if (err.response) {
      console.log('API error:', err.response);
      throw new Error(err.response.message || 'Lấy thông categories thất bại');
    } else if (err.request) {
      console.log('No response from API:', err.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', err.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

// get menu item
export const getMenuItem = async categoryId => {
  try {
    const url = `v1/menu-items/get-by-category/${categoryId}`; // Endpoint API
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.get(url); // GET request không cần body
    // console.log(res.data,'=========API MENU ITEM=============');
    return res.data; // Trả về dữ liệu từ API
  } catch (err) {
    if (err.response) {
      console.log('API error:', err.response);
      throw new Error(
        err.response.message || 'Lấy thông tin menu-items thất bại',
      );
    } else if (err.request) {
      console.log('No response from API:', err.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', err.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

// Get Table
export const getTables = async tableId => {
  try {
    const url = `v1/tables/${tableId}`; // Endpoint API
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.get(url); // GET request không cần body
    // console.log(res.data,'=========API Table=============');
    return res.data; // Trả về dữ liệu từ API
  } catch (err) {
    if (err?.response) {
      console.log('API error:', err?.response);
      //throw new Error(err?.response?.message || 'Lấy thông tin table thất bại');
    } else if (err?.request) {
      console.log('No response from API:', err?.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', err?.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

// Create Order
export const postOrder = async () => {
  try {
    // Lấy dữ liệu giỏ hàng từ AsyncStorage
    let cartItems = await AsyncStorage.getItem('cartItems');
    let tableId = await AsyncStorage.getItem('idTable');
    console.log('...tableId ', tableId);

    cartItems = cartItems ? JSON.parse(cartItems) : [];

    // Chuyển đổi dữ liệu giỏ hàng sang định dạng API yêu cầu
    const items = cartItems.map(item => ({
      menuItemId: item.id,
      options: item.option?.name || '',
      quantity: item.quantity,
    }));

    // Dữ liệu để gửi lên API
    const data = {
      items: items,
    };
    // Gửi yêu cầu POST lên API
    const axiosInstance = await AxiosInstance();
    const response = await axiosInstance.post(
      `v1/tables/${tableId}/orders`,
      data,
    );

    return response;
  } catch (error) {
    console.error('Error placing order:', error);
  }
};

// get Order User
export const getOrderUser = async () => {
  try {
    const url = `v1/orders/`; // Endpoint API
    let token = await AsyncStorage.getItem('token');

    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.get(url, token); // GET request và gửi token user

    // Trả về dữ liệu từ API
    return res;
  } catch (err) {
    if (err.response) {
      console.log('API error:', err.response.data);
      throw new Error(err.response.message || 'Chưa đặt món');
    } else if (err.request) {
      console.log('No response from API:', err.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', err.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

// get Order User
export const getOrderTable = async () => {
  try {
    const idTable = await AsyncStorage.getItem('idTable');
    if (!idTable) {
      throw new Error('ID Table không tồn tại');
    }
    const url = `v1/orders/get-order-by-tableId/${idTable}`; // Chèn idTable vào URL

    const axiosInstance = await AxiosInstance();
    const response = await axiosInstance.get(url); // GET request tới URL đã chỉnh sửa

    // Trả về dữ liệu từ API
    return response;
  } catch (err) {
    if (err.response) {
      console.log('API error:', err.response.data);
      throw new Error(err.response.data.message || 'Chưa đặt món table');
    } else if (err.request) {
      console.log('No response from API:', err.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', err.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

// DeleteOrder
export const deleteOrder = async (tableId, itemId) => {
  try {
    if (!tableId || !itemId) {
      throw new Error('Invalid tableId or itemId');
    }
    const axiosInstance = await AxiosInstance();
    const response = await axiosInstance.delete(`v1/tables/${tableId}/orders/${itemId}`);
    return response; // Trả về phản hồi từ API nếu cần
  } catch (error) {
    if(error.response.data.message === "Time out to delete"){
      ToastAndroid.show("Hết thời gian r thằng lồn", ToastAndroid.SHORT);
    }
    console.log('Error deleting order:', error.response.data);
    throw error; // Đảm bảo lỗi được truyền ra ngoài
  }
};

export const paymentCodUser = async () => {
  try {
    const tableId = await AsyncStorage.getItem('idTable');
    if (!tableId) {
      throw new Error('Không tìm thấy ID bàn');
    }
    const url = `v1/payments/cashpayment/${tableId}?userId=true`;
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.post(url);
    return res.data;
  } catch (err) {
    if (err.response) {
      console.log('API error:', err.response.data);
      throw new Error(err.response.data.message || 'Món chưa hoàn thành');
    } else if (err.request) {
      console.log('No response from API:', err.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', err.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

export const paymentZaloUser = async () => {
  try {
    const tableId = await AsyncStorage.getItem('idTable');
    if (!tableId) {
      throw new Error('Không tìm thấy ID bàn');
    }
    const url = `v1/payments/zalopayment/${tableId}?userId=true`;
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.post(url);
    return res;
  } catch (err) {
    if (err.response) {
      console.log('API error:', err.response.data);
      throw new Error(err.response.data.message || 'Món chưa hoàn thành');
    } else if (err.request) {
      console.log('No response from API:', err.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', err.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};
