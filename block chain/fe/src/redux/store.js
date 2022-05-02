import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import alertReducer from "./alert";
export const store = configureStore({
  reducer: {
    user: userReducer,
    alert: alertReducer,
  },
});
