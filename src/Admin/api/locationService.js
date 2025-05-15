import axios from 'axios';
import {https, CYBER_TOKERN} from './config';



export const getLocationService = () => {
    return https.get("https://airbnbnew.cybersoft.edu.vn/api/vi-tri");
}

const API_URL = "https://airbnbnew.cybersoft.edu.vn/api/vi-tri";

// export const addLocationService = (id) => {
//     const url = `https://airbnbnew.cybersoft.edu.vn/api/vi-tri/1?=${id}`;
//     return https.post(url);
// }

// Thêm vị trí
export const addLocationService = async (form) => {
    const userInfo = JSON.parse(localStorage.getItem("USER"));
    try {
      const response = await axios.post(API_URL, form, {
        headers: {
          tokenCybersoft: CYBER_TOKERN,
          token: userInfo.token,
        },
      });
      return response.data.content;
    } catch (err) {
      console.error("Lỗi khi thêm vị trí:", err.response?.data || err.message);
      throw err;
    }
  };

// export const updateLocationService = (id, data) => {
//     const url = `https://airbnbnew.cybersoft.edu.vn/api/vi-tri/${id}`;
//     return https.put(url, data);
// }
// Cập nhật vị trí
export const updateLocationService = (id, form) => {
    const userInfo = JSON.parse(localStorage.getItem("USER"));
    return axios.put(`${API_URL}/${id}`, form, {
      headers: {
        tokenCybersoft: CYBER_TOKERN,
        token: userInfo.token,
      },
    });
  };


// export const deleteLocationService = (id) => {
//     const url = `https://airbnbnew.cybersoft.edu.vn/api/vi-tri/1?=${id}`;
//     return https.delete(url);
// }
// Xóa vị trí
export const deleteLocationService = (id) => {
    const userInfo = JSON.parse(localStorage.getItem("USER"));
    return axios.delete(`${API_URL}/${id}`, {
      headers: {
        tokenCybersoft: CYBER_TOKERN,
        token: userInfo.token,
      },
    });
  };
  