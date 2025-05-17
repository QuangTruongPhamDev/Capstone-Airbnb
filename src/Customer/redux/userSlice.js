import { createSlice } from "@reduxjs/toolkit";
import { updateAuthToken } from "../api/config";
import {
  clearUser,
  getStoredUser,
  storeUser,
} from "../../utils/LocalStorageHelper";

const initialState = {
  user: getStoredUser(),
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUserAction: (state, action) => {
      const { token, user } = action.payload;
      state.user = { ...user, token };
      storeUser(state.user);
      updateAuthToken(token); // cập nhật token vào Axios
    },
    logOutAction: (state) => {
      state.user = null;
      clearUser();
      updateAuthToken("");
    },
  },
});

export const { setUserAction, logOutAction } = userSlice.actions;

export default userSlice.reducer;
