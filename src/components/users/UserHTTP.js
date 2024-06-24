import AxiosInstance from "../../helper/AxiosInstance";

export const login = async (email, password) => {
    try {
      const url = 'users/login';
      const body = {email, password};
      const res = await AxiosInstance().post(url, body);
      return res;
    } catch (err) {
      return err;
    }
  };
  
  export const register = async (fullName, email, password) => {
    try {
      const url = 'v1/users/register';
      const body = {fullName ,email, password};
      const res = await AxiosInstance().post(url, body);
      return res;
    } catch (err) {
    
      console.log('lỗi đăng ký ' + err);
    }
  };