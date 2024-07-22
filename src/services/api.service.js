import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 5000,
  headers: {
    "X-Custom-Header": "foobar",
  },
});

// Перехватчик для добавления токена к каждому запросу
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export const logInUser = (userData) => {
  const params = new URLSearchParams(userData).toString();
  return instance.post(`/users/signin?${params}`);
};

export default instance;

export const signInUser = (userData) => {
  const params = new URLSearchParams(userData).toString();
  return instance.post(`/users/signup?${params}`);
};

export const confirmOtpCode = (otpCode) => {
  const confirmationCode = new URLSearchParams(otpCode).toString();
  return instance.post(`/users/verify-email?${confirmationCode}`);
};

export const googleLogInUser = () => {
  return instance.get(`/start-google-login`);
};
