import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isError: false,
  isSuccess: false,
  errorMsg: "",
  successMsg: "",
};
export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setIsError: (state, action) => {
      state.isError = action.payload;
    },
    setIsSuccess: (state, action) => {
      state.isSuccess = action.payload;
    },
    setErrorMsg: (state, action) => {
      state.errorMsg = action.payload;
      state.isError = true;
    },
    setSuccessMsg: (state, action) => {
      state.successMsg = action.payload;
      state.isSuccess = true;
    },
  },
});
export const { setIsError, setIsSuccess, setErrorMsg, setSuccessMsg } =
  alertSlice.actions;
export default alertSlice.reducer;
