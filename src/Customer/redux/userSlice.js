import { createSlice } from "@reduxjs/toolkit";
import { updateAuthToken } from "../api/config";

let userData = null;
try {
  const userJson = localStorage.getItem("USER");
  if (userJson) {
    userData = JSON.parse(userJson);
    updateAuthToken(userData.accessToken); // đảm bảo token có sau khi refresh
  }
} catch (error) {
  console.error("Error parsing user data:", error);
}

const initialState = {
  user: userData,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUserAction: (state, action) => {
      state.user = action.payload.user;
      localStorage.setItem("USER", JSON.stringify(action.payload));
      updateAuthToken(action.payload.token); // cập nhật token axios
    },
    logOutAction: (state) => {
      state.user = null;
      localStorage.removeItem("USER");
      updateAuthToken(""); // xoá token khỏi axios
    },
  },
});

export const { setUserAction, logOutAction } = userSlice.actions;

export default userSlice.reducer;
