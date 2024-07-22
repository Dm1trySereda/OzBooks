import apiService from "@/services/api.service.js";
import localStorageService from "@/services/local-storage.service.js";

class UserService {
  constructor() {
    this.apiService = apiService;
    this.localStorageService = localStorageService;
  }
  async logInUser(userData) {
    const params = new URLSearchParams(userData).toString();
    const response = await this.apiService.post(`/users/signin?${params}`);
    const { tokenType, accessToken } = response.data;
    this.localStorageService.setToken(tokenType, accessToken);
    return response;
  }
  async signInUser(userData) {
    const params = new URLSearchParams(userData).toString();
    const response = await this.apiService.post(`/users/signup?${params}`);
    return response;
  }
  async confirmOtpCode(otpCode) {
    const params = new URLSearchParams(otpCode).toString();
    const response = await this.apiService.post(
      `/users/verify-email?${params}`
    );
    return response;
  }
  async googleLogInUser(googleCode) {
    const params = new URLSearchParams(googleCode).toString();
    const response = await this.apiService.get(
      `/process-google-login?${params}`
    );
    const { tokenType, accessToken } = response.data;
    this.localStorageService.setGoogleAccessToken(tokenType, accessToken);
    const { url } = response.data;
    window.location.href = url;
  }
  async getUserProfile() {
    const response = await this.apiService.get(`/users/my-profile`);
    return response.data;
  }
}
export default new UserService();
