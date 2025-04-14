import { https, updateAuthToken } from "./config";

export const loginService = async (user) => {
  const url = `/api/auth/signin`;
  const response = await https.post(url, user);

  // Lưu token vào localStorage
  const userInfo = response.data.content;
  localStorage.setItem("USER", JSON.stringify(userInfo));

  // Cập nhật token vào axios
  updateAuthToken(userInfo.accessToken);

  return response;
};
