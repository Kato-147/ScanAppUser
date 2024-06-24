import AxiosInstance from '../../helper/AxiosInstance';

// infor user profile
export const infoProfile = async () => {
  
  try {
    const url = 'v1/users/me'; // Endpoint API
    const res = await AxiosInstance().get(url); // GET request không cần body
    return res; // Trả về dữ liệu từ API
  } catch (err) {
    if (err.response) {
      console.log('API error:', err.response);
      throw new Error(
        err.response.message || 'Lấy thông tin user thất bại',
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
