import AxiosInstance from '../../helper/AxiosInstance';

// infor user profile
export const infoProfile = async () => {
  try {
    const url = 'v1/users/me'; // Endpoint API
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.get(url); // GET request không cần body
    console.log(res);
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
export const getMenuItem = async (categoryId) => {
  try {
    const url = `v1/menu-items/get-by-category/${categoryId}`; // Endpoint API
    const axiosInstance = await AxiosInstance();
    const res = await axiosInstance.get(url); // GET request không cần body
   // console.log(res.data,'=========API MENU ITEM=============');
    return res.data; // Trả về dữ liệu từ API
  } catch (err) {
    if (err.response) {
      console.log('API error:', err.response);
      throw new Error(err.response.message || 'Lấy thông tin menu-items thất bại');
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
export const getTables = async (tableId) => {
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
export const postOrder = async (userId, tableId) => {
  console.log('..UserId ', userId,'...tableId ', tableId);
  try {
    // Lấy dữ liệu giỏ hàng từ AsyncStorage
    let cartItems = await AsyncStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    console.log('CartItem When post api ....', cartItems);

    // Chuyển đổi dữ liệu giỏ hàng sang định dạng API yêu cầu
    const items = cartItems.map(item => ({
      menuItemId: item.id,
      quantity: item.quantity,
      options: item.option || "",
    }));

    // Dữ liệu để gửi lên API
    const data = {
      items: items,
    };

    // Gửi yêu cầu POST lên API
    const response = await axios.post(`v1/users/${userId}/tables/${tableId}/orders`, data);
    
    // Kiểm tra kết quả trả về từ API
    if (response.status === 200) {
      console.log('Order successfully placed:', response.data);
      // Clear dữ liệu cartItems trong AsyncStorage
      await AsyncStorage.removeItem('cartItems');
      console.log('Cart items cleared');
      
    } else {
      console.error('Failed to place order:', response.data);
    }
  }catch (error) {
    console.error('Error placing order:', error);
  }
};
