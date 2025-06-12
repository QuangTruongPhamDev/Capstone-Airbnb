import axios from "axios";
import { https, CYBER_TOKERN } from "./config"; // Giả sử https và CYBER_TOKERN đã được cấu hình đúng

const API_URL = "https://airbnbnew.cybersoft.edu.vn/api/phong-thue";

// Hàm helper để lấy token và kiểm tra (giống như đã đề xuất ở lần trước)
const getUserToken = () => {
  const userInfoString = localStorage.getItem("USER");
  if (!userInfoString) {
    console.error("Không tìm thấy thông tin người dùng trong localStorage.");
    return null;
  }
  const userInfo = JSON.parse(userInfoString);
  if (!userInfo || !userInfo.token) {
    console.error("Token không hợp lệ hoặc không tồn tại.");
    return null;
  }
  return userInfo.token;
};

// ... (getAdminService, addroomService, updateRoomService, deleteRoomService như đã sửa ở lần trước) ...
export const getAdminService = () => {
  return https.get("/api/phong-thue").catch((err) => {
    console.error(
      "Lỗi khi tải danh sách phòng (service):",
      err.response?.data || err.message
    );
    throw err.response?.data || new Error("Không thể tải danh sách phòng.");
  });
};
// export const getAdminService = (
//   pageIndex = 1,
//   pageSize = 10,
//   keyword = ""
// ) => {
//   const userInfo = JSON.parse(localStorage.getItem("USER"));

//   return axios.get(`${API_URL}/phan-trang-tim-kiem`, {
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


// export const uploadRoomImage = (roomId, file) => {
//   const formData = new FormData();
//   formData.append("formFile", file);

//   return axios.post(
//     `${API_URL}/upload-hinh-phong?maPhong=${roomId}`,
//     formData,
//     {
//       headers: {
//         tokenCybersoft: CYBER_TOKERN,
//         token: token,
//       },
//     }
//   );
// };


// export const getAdminServices = {
//   getRoomListPagination: (pageIndex = 1, pageSize = 10, keyword = "") => {
//     return axios.get(`${API_URL}/phan-trang-tim-kiem`, {
//       params: {
//         pageIndex,
//         pageSize,
//         keyword
//       },
//       headers: {
//         TokenCybersoft: CYBER_TOKERN
//       }
//     });
//   }
// }

export const addroomService = async (form) => {
  const token = getUserToken();
  if (!token) {
    throw new Error("Bạn cần đăng nhập");
  }

  try {
    const response = await axios.post(API_URL, form, {
      headers: {
        tokenCybersoft: CYBER_TOKERN,
        token: token,
      },
    });

    console.log("Add Room Response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Lỗi thêm phòng:", err.response?.data || err.message);
    throw err.response?.data || new Error("Lỗi khi thêm phòng");
  }
};

export const updateRoomService = async (id, form) => {
  const token = getUserToken();
  if (!token) {
    return Promise.reject({
      message: "Bạn cần đăng nhập để thực hiện hành động này.",
      type: "AUTH_ERROR",
    });
  }
  try {
    const response = await axios.put(`${API_URL}/${id}`, form, {
      headers: { tokenCybersoft: CYBER_TOKERN, token: token },
    });

    // Nếu API không trả lại data, tự cấu hình object trả về từ `form`
    if (response.data.content) {
      return response.data.content;
    } else {
      // Tự build lại object từ form nếu là FormData
      const result = { id };
      for (let [key, value] of form.entries()) {
        result[key] = value;
      }
      return result;
    }
  } catch (err) {
    console.error(
      "Lỗi khi cập nhật phòng (service):",
      err.response?.data || err.message
    );
    throw (
      err.response?.data ||
      new Error(err.response?.data?.message || "Lỗi khi cập nhật phòng.")
    );
  }
};

export const deleteRoomService = async (id) => {
  const token = getUserToken();
  if (!token) {
    return Promise.reject({
      message: "Bạn cần đăng nhập để thực hiện hành động này.",
      type: "AUTH_ERROR",
    });
  }
  const url = `/api/phong-thue/${id}`;
  try {
    const response = await https.delete(url, {
      headers: { token: token, tokenCybersoft: CYBER_TOKERN },
    });
    return response.data.content;
  } catch (err) {
    console.error(
      "Lỗi khi xóa phòng (service):",
      err.response?.data || err.message
    );
    throw (
      err.response?.data ||
      new Error(err.response?.data?.message || "Lỗi khi xóa phòng.")
    );
  }
};

/**
 * 🆕 API: Upload hình ảnh phòng
 * @param {string | number} roomId - mã phòng (API Swagger ghi là string, nhưng number cũng thường được chấp nhận)
 * @param {File} file - file hình ảnh (.jpg/.png)
 */
export const uploadRoomImageService = async (roomId, file) => {
  const token = getUserToken();
  if (!token) throw new Error("Bạn cần đăng nhập để upload ảnh");

  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  console.log("File được chọn:", file);
  console.log("Loại file:", file.type);

  if (!validTypes.includes(file.type)) {
    throw new Error(`File không hợp lệ (${file.type}). Chỉ chấp nhận JPG/PNG`);
  }

  const formData = new FormData();
  formData.append("formFile", file); // <-- kiểm tra lại nếu backend yêu cầu key khác

  try {
    const response = await axios.post(
      `${API_URL}/upload-hinh-phong?maPhong=${roomId}`,
      formData,
      {
        headers: {
          tokenCybersoft: CYBER_TOKERN,
          token: token,
        },
        timeout: 10000,
      }
    );

    if (!response.data) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return response.data;
  } catch (error) {
    console.error("Chi tiết lỗi upload:", {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    throw new Error(error.response?.data?.message || "Lỗi khi upload ảnh");
  }
};
