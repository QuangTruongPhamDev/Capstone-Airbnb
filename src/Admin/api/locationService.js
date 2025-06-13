import axios from "axios";
import { CYBER_TOKERN } from "./config";

// export const getLocationService = () => {
//     return https.get("https://airbnbnew.cybersoft.edu.vn/api/vi-tri");
// }

// export const getLocationService = () => {
//   return axios.get(`https://airbnbnew.cybersoft.edu.vn/api/vi-tri`, {
//     headers: {
//       tokenCybersoft: CYBER_TOKERN,
//     },
//   });
// };

export const getLocationService = (
  pageIndex = 1,
  pageSize = 10,
  keyword = ""
) => {
  const userInfo = JSON.parse(localStorage.getItem("USER"));

  return axios.get(`${API_URL}/phan-trang-tim-kiem`, {
    params: { pageIndex, pageSize, keyword },
    headers: {
      tokenCybersoft: CYBER_TOKERN,
      token: userInfo?.token,
    },
  });
};

const API_URL = "https://airbnbnew.cybersoft.edu.vn/api/vi-tri";

const api_url =
  "https://airbnbnew.cybersoft.edu.vn/api/phong-thue/phan-trang-tim-kiem";

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

export const uploadLocationImageService = (maViTri, formData) => {
  const userInfo = JSON.parse(localStorage.getItem("USER"));
  return axios.post(
    `${API_URL}/upload-hinh-vitri?maViTri=${maViTri}`,
    formData,
    {
      headers: {
        tokenCybersoft: CYBER_TOKERN,
        token: userInfo?.token,
      },
    }
  );
};

// export const searchPaginationLocationService = (
//   pageIndex,
//   pageSize,
//   keyword = ""
// ) => {
//   const userInfo = JSON.parse(localStorage.getItem("USER"));

//   return axios.get(`${api_url}/vi-tri/phan-trang-tim-kiem`, {
//     params: {
//       pageIndex,
//       pageSize,
//       keyword,
//     },
//     headers: {
//       tokenCybersoft: CYBER_TOKERN,
//       token: userInfo?.token,
//     },
//   });
// };

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
