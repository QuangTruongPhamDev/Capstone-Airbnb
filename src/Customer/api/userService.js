import { https, updateAuthToken } from "./config";

export const loginService = async (user) => {
  const url = `/api/auth/signin`;
  try {
    const response = await https.post(url, user);
    if (response && response.data && response.data.content) {
      return response.data.content; // Chỉ trả về phần dữ liệu quan trọng
    } else {
      throw new Error("Định dạng phản hồi đăng nhập không hợp lệ");
    }
  } catch (error) {
    console.error(
      "Lỗi trong loginService:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để component xử lý
  }
};

// ✅ Đăng ký
export const registerService = async (user) => {
  const url = `/api/auth/signup`;
  const response = await https.post(url, user);
  return response;
};

// ✅ Lấy thông tin chi tiết người dùng
export const getUserDetails = (userId) => {
  return https.get(`/api/users/${userId}`);
};

// ✅ Lấy danh sách phòng đã đặt theo người dùng
export const getBookedRoomsByUser = (userId) => {
  return https.get(`/api/dat-phong/lay-theo-nguoi-dung/${userId}`);
};

// ✅ Cập nhật thông tin người dùng
export const updateUserDetails = (userId, updatedData) => {
  return https.put(`/api/users/${userId}`, updatedData);
};

// ✅ Upload ảnh đại diện
export const uploadAvatar = (formData) => {
  return https.post(`/api/users/upload-avatar`, formData);
};

export const getRoomById = (roomId) => {
  return https.get(`/api/phong-thue/${roomId}`);
};
// ✅ Gộp lại để export dễ dùng
export const userService = {
  getUserDetails,
  getBookedRoomsByUser,
  updateUserDetails,
  uploadAvatar,
  getRoomById,
};
