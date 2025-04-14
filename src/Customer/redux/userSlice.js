import { createSlice } from "@reduxjs/toolkit";

const userJson = localStorage.getItem("USER");

const initialState = {
  user: JSON.parse(userJson),
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUserAction: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("USER", JSON.stringify(action.payload));
    },
  },
});

export const { setUserAction } = userSlice.actions;

export default userSlice.reducer;
