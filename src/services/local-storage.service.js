class LocalStorageService {
  setToken(tokenType, accessToken) {
    localStorage.setItem("token", `${tokenType} ${accessToken}`);
  }
  setGoogleAccessToken(tokenType, accessToken) {
    localStorage.setItem("googleAccessToken", `${tokenType} ${accessToken}`);
  }

  getToken() {
    return localStorage.getItem("token");
  }
  getGoogleAccessToken() {
    return localStorage.getItem("googleAccessToken");
  }

  clearToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("googleAccessToken");
  }
  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export default new LocalStorageService();
