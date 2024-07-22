import apiService from "@/services/api.service.js";
import localStorageService from "@/services/local-storage.service.js";

class BooksService {
  constructor() {
    this.apiService = apiService;
    this.localStorageService = localStorageService;
  }
  async getBooks(booksData) {
    const params = new URLSearchParams(booksData).toString();
    const response = await this.apiService.get(`/books/?${params}`);
    return response;
  }
  async searchBooks(booksData) {
    const params = new URLSearchParams(booksData).toString();
    const response = await this.apiService.get(`/books/search/?${params}`);
    return response;
  }
}
export default new BooksService();
