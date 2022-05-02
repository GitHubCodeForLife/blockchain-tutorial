import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: localStorage.getItem("token") ? true : false,
  token: localStorage.getItem("token") || "",
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setToken: (state, action) => {
      if (action.payload != "" && action.payload != null) {
        state.token = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload);
      } else {
        state.token = "";
        state.isAuthenticated = false;
        localStorage.removeItem("token");
      }
    },
  },
});
export const { setToken } = userSlice.actions;
export default userSlice.reducer;
