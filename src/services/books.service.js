import apiService from "@/services/api.service.js";
import localStorageService from "@/services/local-storage.service.js";
import qs from "qs";

class BooksService {
  constructor() {
    this.apiService = apiService;
    this.localStorageService = localStorageService;
  }
  async getBooks(booksData) {
    const params = qs.stringify(booksData, { arrayFormat: "repeat" });
    const response = await this.apiService.get(`/books/?${params}`);
    return response;
  }
  async searchBooks(booksData) {
    const params = qs.stringify(booksData, { arrayFormat: "repeat" });
    const response = await this.apiService.get(`/books/search/?${params}`);
    return response;
  }
  async getMostPopularauthors(count) {
    const params = new URLSearchParams(count).toString();
    const response = await this.apiService.get(
      `/books/search/popular-authors?${params}`
    );
    return response;
  }
  async getPublishingYears(count) {
    const params = new URLSearchParams(count).toString();
    const response = await this.apiService.get(
      `/books/search/publishing-years?${params}`
    );
    return response;
  }
}
export default new BooksService();
