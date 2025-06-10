import axios from "axios";
import { https, CYBER_TOKERN } from "./config";

// export const getUserService = () => {
//     return https.get("https://airbnbnew.cybersoft.edu.vn/api/users");
// }

const API_URL = "https://airbnbnew.cybersoft.edu.vn/api/users";

export const getUserService = (pageIndex = 1, pageSize = 10, keyword = "") => {
  const userInfo = JSON.parse(localStorage.getItem("USER"));
  return https.get(
    `${API_URL}/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`,
    {
      headers: {
        tokenCybersoft: CYBER_TOKERN,
        token: userInfo?.token,
      },
    }
  );
};

export const logoutAndDeleteUser = async (userId, navigate) => {
  // token ADMIN thật sự
  try {
    await https.delete(
      `https://airbnbnew.cybersoft.edu.vn/api/users?id=${userId}`,
      {
        headers: {
          tokenCybersoft: CYBER_TOKERN,
        },
      }
    );

    // Xóa localStorage
    localStorage.removeItem("USER_LOGIN");
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("newlyCreatedUserId");

    // Điều hướng về home
    navigate("/home");
  } catch (error) {
    console.error("Xóa tài khoản khi đăng xuất thất bại:", error);
  }
};

// export const UploadAvatarUserService = (file) => {
//   const formData = new FormData();
//   formData.append("avatar", file); // Tên field "avatar" phải khớp với tên mà backend mong đợi

//   // Giả sử token người dùng được lưu trong localStorage hoặc một biến global
//   // const token = getLocalStorage("user")?.token; // Ví dụ
//   const token = JSON.parse(localStorage.getItem("USER"))?.token; // Thay thế bằng token thực tế nếu API yêu cầu

//   return axios.post(
//     `${API_URL}/users/upload-avatar`, // Endpoint này có thể khác, bạn cần kiểm tra lại tài liệu API
//     formData,
//     {
//       headers: {
//         tokenCybersoft: CYBER_TOKERN,
//         token: token, // Nếu API yêu cầu token người dùng cho việc upload avatar
//       },
//     }
//   );
// };

export const UploadAvatarUserService = (file) => {
  const formData = new FormData();
  formData.append("formFile", file);

  const token = JSON.parse(localStorage.getItem("USER"))?.token || "";

  return axios.post(
    "https://airbnbnew.cybersoft.edu.vn/api/users/upload-avatar",
    formData,
    {
      headers: {
        tokenCybersoft: CYBER_TOKERN,
        token: token,
      },
    }
  );
};

// Đảm bảo bạn có hàm getUserService, updateUserService và deleteUserService trong file này
// Hoặc import chúng từ các file khác nếu chúng ở riêng biệt.

// Đảm bảo bạn export các service khác nữa
// export const deleteUserService = (id) => { ... };
// export const getUserService = (page, pageSize, keyword) => { ... };
// export const updateUserService = (id, data) => { ... };

export const addUserService = (id) => {
  const url = `https://airbnbnew.cybersoft.edu.vn/api/users/${id}`;
  return https.post(url);
};

// export const updateUserService = (id) => {
//     const url = `https://airbnbnew.cybersoft.edu.vn/api/users/${id}`;
//     return https.put(url);
// }
export const updateUserService = (id, adminForm) => {
  const url = `https://airbnbnew.cybersoft.edu.vn/api/users/${id}`;
  return https.put(url, adminForm, {
    headers: {
      tokenCybersoft: CYBER_TOKERN,
    },
  });
};

export const deleteUserService = (id) => {
  const url = `https://airbnbnew.cybersoft.edu.vn/api/users?id=${id}`;
  return https.delete(url);
};
