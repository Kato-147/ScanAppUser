import AsyncStorage from '@react-native-async-storage/async-storage';
import AxiosInstance from '../../helper/AxiosInstance';
import {ToastAndroid} from 'react-native';

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
    const res = await axiosInstance.get(url); // GET request no need body
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
export const getTables = async (tableId, tableType) => {
  try {

    console.log('Table type request to sever : ', tableType ,tableId);
    
    const url = `v1/tables/${tableId}?type=${tableType}`; // Endpoint API
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.get(url); // GET request không cần body
    console.log('===================api get table=================');
    console.log(res);
    console.log('====================================');
    await AsyncStorage.setItem(
      'tableNumber',
      JSON.stringify(res.data.tableNumber),
    );
   
    return res; // Trả về dữ liệu từ API
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

// Create Order in cart
export const postOrder = async () => {
  try {
    // Lấy dữ liệu giỏ hàng từ AsyncStorage
    let cartItems = await AsyncStorage.getItem('cartItems');
    const id = await AsyncStorage.getItem('idTable');
    const tableId = JSON.parse(id).tableId;
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
export const getOrderTable = async promotionCode => {
  try {
    const id = await AsyncStorage.getItem('idTable');
    const tableId = JSON.parse(id).tableId;
    if (!tableId) {
      throw new Error('ID Table không tồn tại');
    }
    const body = promotionCode;
    console.log('body getOrder table resquest to sever', body);
    const url = `v1/tables/${tableId}/orders?&promotionCode=${body}`; // Chèn idTable vào URL

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

//get Order user
export const getOrderUserApi = async (promotionCode) => {
  try {
    const id = await AsyncStorage.getItem('idTable');
    const tableId = JSON.parse(id).tableId;
    if (!tableId) {
      throw new Error('ID Table không tồn tại');
    }
    const body = promotionCode;
    console.log('body getOrder User resquest to sever', body);
    const url = `v1/tables/${tableId}/orders/get-order-for-client?userId=true`; // Endpoint API

    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.get(url); // GET request và gửi token user
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

// get Order Table
export const getOrderTableApi = async promotionCode => {
  try {
    const id = await AsyncStorage.getItem('idTable');
    const tableId = JSON.parse(id).tableId;
    if (!tableId) {
      throw new Error('ID Table không tồn tại');
    }
    const body = promotionCode;
    console.log('body getOrder table resquest to sever', body);
    const url = `v1/tables/${tableId}/orders/get-order-for-client`; // Chèn idTable vào URL

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
    const response = await axiosInstance.delete(
      `v1/tables/${tableId}/orders/items/${itemId}`,
    );
    return response; // Trả về phản hồi từ API nếu cần
  } catch (error) {
    if (error.response.data.message === 'Time out to delete') {
      ToastAndroid.show('Hết thời gian để hủy món', ToastAndroid.SHORT);
    }
    if (
      error.response.data.message === "You cannot delete other people's item"
    ) {
      ToastAndroid.show('Không thể hủy món của người khác', ToastAndroid.SHORT);
    }
    console.log('Error deleting order:', error.response.data);
    throw error; // Đảm bảo lỗi được truyền ra ngoài
  }
};

// Pay for user with cash
export const paymentCodUser = async promotionCode => {
  const tableNumber = await AsyncStorage.getItem('tableNumber');
  const userId = await AsyncStorage.getItem('userID');
  try {
    const body = {
      tableNumber: tableNumber,
      voucher: promotionCode,
      userId: userId,
    };
    console.log('body --------- ', body);

    const url = `v1/payments/notification-payment`;
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.post(url, body);
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

// Pay for user with ZaloPay
export const paymentZaloUser = async (promotionCode) => {
  const tableNumber = await AsyncStorage.getItem('tableNumber');
  const userId = await AsyncStorage.getItem('userID');
  const id = await AsyncStorage.getItem('idTable');
    const tableId = JSON.parse(id).tableId;
  try {
    const body = {
      tableNumber: tableNumber,
      promotionCode: promotionCode,
      userId: userId,
    };
    console.log('body --------- ', body);
    const url = `v1/payments/zalopayment/${tableId}?userId=true`;
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.post(url,body);
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

// Pay for table with cash
export const paymentCodTable = async promotionCode => {
  const tableNumber = await AsyncStorage.getItem('tableNumber');
  const userId = await AsyncStorage.getItem('userID');
  try {
    const body = {
      tableNumber: tableNumber,
      voucher: promotionCode,
      userId: userId,
    };
    console.log('body --------- ', body);

    const url = `v1/payments/notification-payment`;
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.post(url, body);
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

// Pay for table with ZaloPay
export const paymentZaloTable = async (promotionCode) => {
  const tableNumber = await AsyncStorage.getItem('tableNumber');
  const userId = await AsyncStorage.getItem('userID');
  const id = await AsyncStorage.getItem('idTable');
    const tableId = JSON.parse(id).tableId;
  try {
    const body = {
      tableNumber: tableNumber,
      promotionCode: promotionCode,
      userId: userId,
    };
    console.log('body --------- ', body);
    const url = `v1/payments/zalopayment/${tableId}`;
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.post(url,body);
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

// Get all available voucher
export const getApiVoucher = async () => {
  try {
    const url = `v1/promotions?isActive=true`;
    const axiosInstance = await AxiosInstance();
    const response = await axiosInstance.get(url); // GET request tới URL đã chỉnh sửa
    // Trả về dữ liệu từ API
    return response;
  } catch (error) {
    if (error.response) {
      console.log('API error:', error.response.data);
      throw new Error(error.response.data.message || 'Lỗi get voucher');
    } else if (error.request) {
      console.log('No response from API:', error.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', error.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

// Get History Order
export const getHistoryOrder = async () => {
  try {
    const url = `v1/payments/payments-history`;
    const axiosInstance = await AxiosInstance();
    const response = await axiosInstance.get(url); // GET request tới URL đã chỉnh sửa
    // Trả về dữ liệu từ API
    return response;
  } catch (error) {
    if (error.response) {
      console.log('API error:', error.response.data);
      throw new Error(error.response.data.message || 'Lỗi get historyOrder');
    } else if (error.request) {
      console.log('No response from API:', error.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', error.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

// Create Soft QR Code
export const createQRCodeApi = async () => {
  try {
    const data = await AsyncStorage.getItem('idTable');
    const idTable = JSON.parse(data).tableId;
    const url = `v1/tables/table-in-use/${idTable}`;
    const axiosInstance = await AxiosInstance();
    const response = await axiosInstance.post(url); // GET request tới URL đã chỉnh sửa

    // Trả về dữ liệu từ API
    return response;
  } catch (error) {
    if (error.response) {
      console.log('API error:', error.response.data);
      throw new Error(error.response.data.message || 'Lỗi create qr code');
    } else if (error.request) {
      console.log('No response from API:', error.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', error.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

// Get all User in table
export const getUserInTableApi = async () => {
  try {
    const data = await AsyncStorage.getItem('idTable');
    const tableId = JSON.parse(data).tableId;
    const url = `v1/tables/table-in-use/${tableId}`;
    const axiosInstance = await AxiosInstance();
    const response = await axiosInstance.get(url);
    // Trả về dữ liệu từ API
    return response;
  } catch (error) {
    if (error.response) {
      console.log('API error:', error.response.data);
      throw new Error(error.response.data.message || 'Lỗi get all user in table');
    } else if (error.request) {
      console.log('No response from API:', error.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', error.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

// Logout table in menu
export const logOutTableApi = async()=>{
  try {
    const url = `v1/tables/table-in-use`;
    const axiosInstance = await AxiosInstance();
    const response = await axiosInstance.patch(url);
    // Trả về dữ liệu từ API
    return response;
  } catch (error) {
    if (error.response) {
      console.log('API error:', error.response.data);
      throw new Error(error.response.data.message || 'Lỗi get all user in table');
    } else if (error.request) {
      console.log('No response from API:', error.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', error.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
}
