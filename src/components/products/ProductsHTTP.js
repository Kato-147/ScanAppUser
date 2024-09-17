import AsyncStorage from '@react-native-async-storage/async-storage';
import AxiosInstance from '../../helper/AxiosInstance';

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
    console.log('Table type request to sever : ', tableType, tableId);

    const url = `v1/tables/${tableId}?type=${tableType}`; // Endpoint API
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.get(url); // GET request không cần body
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

//get Order user
export const getOrderUserApi = async promotionCode => {
  try {
    const id = await AsyncStorage.getItem('idTable');
    const tableId = JSON.parse(id).tableId;
    if (!tableId) {
      throw new Error('ID Table không tồn tại');
    }
    console.log('promotionCode getOrder User resquest to sever', promotionCode);
    const url = `v1/tables/${tableId}/orders/get-order-for-client?userId=true&promotionCode=${promotionCode}`; // Endpoint API

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
    console.log(
      'promotionCode getOrder Table resquest to sever',
      promotionCode,
    );

    const url = `v1/tables/${tableId}/orders/get-order-for-client?promotionCode=${promotionCode}`; // Chèn idTable vào URL

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
export const deleteOrder = async itemId => {
  try {
    const id = await AsyncStorage.getItem('idTable');
    const tableId = JSON.parse(id).tableId;

    if (!tableId || !itemId) {
      throw new Error('Invalid tableId or itemId');
    }
    const axiosInstance = await AxiosInstance();
    const response = await axiosInstance.delete(
      `v1/tables/${tableId}/orders/items/${itemId}?specifiedTime=180`,
    );
    return response; // Trả về phản hồi từ API nếu cần
  } catch (error) {
    //  console.log('Error deleting order:', error.response.data.message);
    throw error.response.data.message; // Đảm bảo lỗi được truyền ra ngoài
  }
};

// Pay for user with cash
export const paymentCodUser = async promotionCode => {
  const tableNumber = await AsyncStorage.getItem('tableNumber');
  const id = await AsyncStorage.getItem('idTable');
  const tableId = JSON.parse(id).tableId;
  try {
    const body = {
      tableNumber: tableNumber,
      promotionCode: promotionCode,
      tableId: tableId,
    };
    console.log('body --------- ', body);

    const url = `v1/payments/notification-payment`;
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.post(url, body);
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

// Pay for user with ZaloPay
export const paymentZaloUser = async promotionCode => {
  const tableNumber = await AsyncStorage.getItem('tableNumber');
  const id = await AsyncStorage.getItem('idTable');
  const userID = await AsyncStorage.getItem('userID');

  const tableId = JSON.parse(id).tableId;
  try {
    const body = {
      tableNumber: tableNumber,
      promotionCode: promotionCode,
      tableId: tableId,
      userIdCash: userID,
    };
    console.log('body --------- ', body);
    const url = `v1/payments/zalopayment/${tableId}?userId=true`;
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.post(url, body);
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
  const id = await AsyncStorage.getItem('idTable');
  const userID = await AsyncStorage.getItem('userID');
  const tableId = JSON.parse(id).tableId;
  try {
    const body = {
      tableNumber: tableNumber,
      voucher: promotionCode,
      tableId: tableId,
      userIdCash: userID,
    };
    console.log('body --------- ', body);

    const url = `v1/payments/notification-payment`;
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.post(url, body);

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

// Pay for table with ZaloPay
export const paymentZaloTable = async promotionCode => {
  const tableNumber = await AsyncStorage.getItem('tableNumber');
  const id = await AsyncStorage.getItem('idTable');
  const userID = await AsyncStorage.getItem('userID');
  const tableId = JSON.parse(id).tableId;

  try {
    const body = {
      tableNumber: tableNumber,
      promotionCode: promotionCode,
      tableId: tableId,
      userIdCash: userID,
    };

    console.log('body --------- ', body);
    const url = `v1/payments/zalopayment/${tableId}`;
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.post(url, body);
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
    const url = `v1/promotions/get-promotion-for-client?requiredPoints=false`;
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

export const getMyPromotionsRedeemedAPI = async () => {
  try {
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.get(
      'v1/promotions/get-my-promotions-redeemed',
    );
    return res;
  } catch (err) {
    const errorMessage = err.response
      ? err.response.data.message
      : err.request
      ? 'Không có phản hồi từ máy chủ'
      : 'Lỗi khi thiết lập yêu cầu';
    console.error('API error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Get History Order
export const getHistoryOrder = async () => {
  try {
    const url = `v1/payments/payments-history`;
    const axiosInstance = await AxiosInstance();
    const response = await axiosInstance.get(url); // GET request tới URL đã chỉnh sửa
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
      throw new Error(
        error.response.data.message || 'Lỗi get all user in table',
      );
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
export const logOutTableApi = async () => {
  try {
    const url = `v1/tables/table-in-use`;
    const axiosInstance = await AxiosInstance();
    const response = await axiosInstance.patch(url);

    // Trả về dữ liệu từ API
    return response;
  } catch (error) {
    if (error.response) {
      console.log('API error:', error.response.data);
      throw new Error(
        error.response.data.message || 'Lỗi get all user in table',
      );
    } else if (error.request) {
      console.log('No response from API:', error.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', error.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

export const createReview = async body => {
  try {
    const url = `v1/reviews`;
    const axiosInstance = await AxiosInstance();
    const response = await axiosInstance.post(url, body);
    return response;
  } catch (error) {
    if (error.response) {
      console.log('API error:', error.response.data);
      throw new Error(error.response.data.message || 'Lỗi tạo đánh giá');
    } else if (error.request) {
      console.log('No response from API:', error.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', error.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

export const getMenuItemDetails = async menuItemId => {
  try {
    const url = `v1/menu-items/menuItem-details/${menuItemId}`;
    const axiosInstance = await AxiosInstance();
    const response = await axiosInstance.get(url);
    return response;
  } catch (error) {
    if (error.response) {
      console.log('API error:', error.response.data);
      throw new Error(
        error.response.data.message || 'Lỗi get menu item details',
      );
    } else if (error.request) {
      console.log('No response from API:', error.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', error.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};

export const getPaymentStatistics = async () => {
  try {
    const url = `v1/statistics/customer-statistics`;
    const axiosInstance = await AxiosInstance();
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('API error:', error.response.data);
      throw new Error(
        error.response.data.message || 'Lỗi get payment statistics',
      );
    } else if (error.request) {
      console.log('No response from API:', error.request);
      throw new Error('Không có phản hồi từ máy chủ');
    } else {
      console.log('Error setting up request:', error.message);
      throw new Error('Lỗi khi thiết lập yêu cầu');
    }
  }
};
