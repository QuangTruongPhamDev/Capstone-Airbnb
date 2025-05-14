import axios from 'axios';
import {https, CYBER_TOKERN} from './config';


export const getReservationService = () => {
    return https.get("https://airbnbnew.cybersoft.edu.vn/api/dat-phong");
}

const API_URL = "https://airbnbnew.cybersoft.edu.vn/api/dat-phong";

// export const addReservationService = (id) => {
//     const url = `https://airbnbnew.cybersoft.edu.vn/api/dat-phong/1?=${id}`;
//     return https.post(url);
// }
// Thêm đặt phòng
export const addReservationService = async (form) => {
    const userInfo = JSON.parse(localStorage.getItem("USER"))?.token;
  
    return axios.post(API_URL, form, {
      headers: {
        token: userInfo.token,
        tokenCybersoft: CYBER_TOKERN,
      },
    });
  };

// export const updateReservationService = (id) => {
//     const url = `https://airbnbnew.cybersoft.edu.vn/api/dat-phong/1?=${id}`;
//     return https.put(url);
// }
// Cập nhật đặt phòng theo id
export const updateReservationService = async (id, form) => {
    const userInfo = JSON.parse(localStorage.getItem("USER"))?.token;
  
    return axios.put(`${API_URL}/${id}`, form, {
      headers: {
        token: userInfo.token,
        tokenCybersoft: CYBER_TOKERN,
      },
    });
  };
  

// export const deleteReservationService = (id) => {
//     const url = `https://airbnbnew.cybersoft.edu.vn/api/dat-phong/1?=${id}`;
//     return https.delete(url);
// }
// Xóa đặt phòng theo id
export const deleteReservationService = async (id) => {
    const userInfo = JSON.parse(localStorage.getItem("USER"))?.token;
  
    return axios.delete(`${API_URL}/${id}`, {
      headers: {
        token: userInfo.token,
        tokenCybersoft: CYBER_TOKERN,
      },
    });
  };