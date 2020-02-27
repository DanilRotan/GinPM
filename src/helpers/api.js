import axios from "axios";

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      if (!config.params) {
        config.params = {};
      }
      config.params.auth = token;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);
