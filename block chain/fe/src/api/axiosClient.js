import axios from "axios";
import { store } from "../redux/store";
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});
axiosClient.interceptors.request.use(
  (config) => {
    config.headers.Authorization = "Bearer " + store.getState().user.token;
    return config;
  },
  (error) => {
    throw error;
  }
);

axiosClient.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    const { status } = error.response;
    if (status === 401) {
      localStorage.clear();
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  }
);
export default axiosClient;
