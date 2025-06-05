import axios from "axios";
import { https, CYBER_TOKERN } from "./config";

// Lấy danh sách phòng
export const getAdminService = () => {
  return https.get("/api/phong-thue");
};

const API_URL = "https://airbnbnew.cybersoft.edu.vn/api/phong-thue";

const api_url = "https://airbnbnew.cybersoft.edu.vn/api/phong-thue/upload-hinh-phong";

// Thêm phòng (FormData với ảnh)
export const addroomService = async (formData) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("USER"));

    const response = await axios.post(`${API_URL}`, formData, {
      headers: {
        tokenCybersoft: CYBER_TOKERN,
        token: `${userInfo.token}`,
      },
    });

    return response; // trả nguyên response để xử lý .data.content ở nơi dùng
  } catch (err) {
    console.error("Lỗi khi thêm phòng:", err.response?.data || err.message);
    throw err;
  }
};

export const uploadRoomImageService = async (formData) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("USER"));

    const response = await axios.post(`${api_url}`, formData, {
      headers: {
        tokenCybersoft: CYBER_TOKERN,
        token: `${userInfo.token}`,
      },
    });

    return response; // trả nguyên response để xử lý .data.content ở nơi dùng
  } catch (err) {
    console.error("Lỗi khi thêm phòng:", err.response?.data || err.message);
    throw err;
  }
};

// Cập nhật phòng (FormData với ảnh)
export const updateRoomService = (id, formData) => {
  const userInfo = JSON.parse(localStorage.getItem("USER"));

  return axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      tokenCybersoft: CYBER_TOKERN,
      token: `${userInfo.token}`,
    },
  });
};

// Xóa phòng
export const deleteRoomService = (id) => {
  const userInfo = JSON.parse(localStorage.getItem("USER"));

  if (!userInfo || !userInfo.token) {
    console.error("Không tìm thấy token. Vui lòng đăng nhập lại.");
    return Promise.reject("token");
  }

  return https.delete(`/api/phong-thue/${id}`, {
    headers: {
      token: `${userInfo.token}`,
      tokenCybersoft: CYBER_TOKERN,
    },
  });
};
