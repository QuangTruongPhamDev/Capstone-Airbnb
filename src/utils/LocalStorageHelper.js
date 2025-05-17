const USER_KEY = "USER";

export const getStoredUser = () => {
  try {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error("Lỗi khi parse localStorage USER:", error);
    return null;
  }
};

export const storeUser = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Lỗi khi lưu localStorage USER:", error);
  }
};

export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};
