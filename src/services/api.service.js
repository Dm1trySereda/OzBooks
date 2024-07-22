import axios from "axios";
import router from "@/router/router.js";
import localStorageService from "@/services/local-storage.service.js";
import checkAuthentication from "@/services/check-auth.service.js";

class ApiService {
  constructor() {
    this.instance = axios.create({
      baseURL: "http://localhost:8000",
      timeout: 5000,
      headers: {
        "X-Custom-Header": "foobar",
      },
    });

    // Перехватчик для добавления токена к каждому запросу
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorageService.getToken();
        if (token) {
          config.headers.Authorization = token;
        }
        return config;
      },

      (error) => {
        return Promise.reject(error);
      }
    );
    // // Перехватчик для обработки ответов
    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 403) {
          localStorageService.clearToken();
          checkAuthentication(router.currentRoute, null, (nextRoute) => {
            if (nextRoute) {
              router.replace(nextRoute);
            }
          });
        }
        return Promise.reject(error);
      }
    );
  }

  // Методы для выполнения запросов
  async get(url, config) {
    return await this.instance.get(url, config);
  }

  async post(url, data, config) {
    return await this.instance.post(url, data, config);
  }

  async put(url, data, config) {
    return await this.instance.put(url, data, config);
  }

  async delete(url, config) {
    return await this.instance.delete(url, config);
  }
}

export default new ApiService();
