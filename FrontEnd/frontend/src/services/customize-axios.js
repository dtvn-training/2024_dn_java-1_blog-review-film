import axios from "axios";
import appURL from "../configs/config";
const instance = axios.create({
  baseURL: appURL,
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

export default instance;
