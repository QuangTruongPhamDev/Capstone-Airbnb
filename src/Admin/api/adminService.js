import axios from 'axios';
import {https, CYBER_TOKERN} from './config';



export const getAdminService = () => {
    return https.get("/api/phong-thue");
}

// export const addroomService = (data) => {
//     const url = `/api/phong-thue`;
//     return https.post(url,data);
// }


const API_URL = "https://airbnbnew.cybersoft.edu.vn/api/phong-thue";

export const addroomService = async (form) => {
    try {
      const response = await axios.post(
        `${API_URL}`,
        form,
        {
          headers: {
            tokenCybersoft: CYBER_TOKERN,
            token: `${JSON.parse(localStorage.getItem("USER")).token}`
          },
        }
      );
  
      return response.data.content; // <- trả dữ liệu về để thêm vào setRooms
    } catch (err) {
      console.log("Lỗi khi thêm phòng:", err.response?.data || err.message);
      throw err;
    }
  };

export const updateRoomService = (id, form) => {
    const userInfo = JSON.parse(localStorage.getItem("USER"));
  
    return axios.put(
      `${API_URL}/${id}`,
      form,
      {
        headers: {
          tokenCybersoft: CYBER_TOKERN,
          token: `${userInfo.token}`,
        },
      }
    );
};

export const deleteRoomService = (id) => {
    const userInfo = JSON.parse(localStorage.getItem("USER"));
  
    if (!userInfo || !userInfo.token) {
      console.error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      return Promise.reject("token");
    }
  
    const url = `/api/phong-thue/${id}`;
  
    return https.delete(url, {
      headers: {
        token: `${userInfo.token}`,
        tokenCybersoft: CYBER_TOKERN, // thay CYBERSOFT_TOKEN bằng token thật của bạn
      },
    });
}