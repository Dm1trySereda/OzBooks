import booksService from "@/services/books.service.js";

const books = {
  namespaced: true,
  state: {
    books: [],
    loading: false,
    filters: true,
    currentPage: 1,
    booksQuantity: 50,
    sortBy: "title",
    orderAsc: true,
    bookTitle: "",
  },
  mutations: {
    SET_BOOKS(state, books) {
      state.books = books;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_FILTERS(state, filters) {
      state.filters = filters;
    },
    SET_CURRENT_PAGE(state, page) {
      state.currentPage = page;
    },
    SET_SORT_BY(state, sortBy) {
      state.sortBy = sortBy;
    },
    SET_ORDER_ASC(state, orderAsc) {
      state.orderAsc = orderAsc;
    },
    SET_BOOK_TITLE(state, bookTitle) {
      state.bookTitle = bookTitle;
    },
  },
  actions: {
    async fetchBooks({ commit, state }, filters = {}) {
      try {
        commit("SET_LOADING", true);
        const bookData = {
          page: state.currentPage,
          books_quantity: state.booksQuantity,
          sort_by: state.sortBy,
          order_asc: state.orderAsc,
          ...filters,
        };
        const response = await booksService.getBooks(bookData);
        commit("SET_BOOKS", response.data);
      } catch (error) {
        console.error(error.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async searchBookForTitle({ commit, state }) {
      try {
        commit("SET_LOADING", true);
        commit("SET_FILTERS", false);
        const bookData = {
          title: state.bookTitle,
        };
        const response = await booksService.searchBooks(bookData);
        commit("SET_BOOKS", response.data);
      } catch (error) {
        console.error(error.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
  getters: {
    getBooks: (state) => state.books,
    getLoadings: (state) => state.loading,
    getFilters: (state) => state.filters,
    getCurrentPage: (state) => state.currentPage,
    getBooksQuantity: (state) => state.booksQuantity,
    getSortBy: (state) => state.sortBy,
    getOrderAsc: (state) => state.orderAsc,
    getbooksQuantity: (state) => state.booksQuantity,
  },
};

export default books;
