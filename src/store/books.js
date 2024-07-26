import booksService from "@/services/books.service.js";

const books = {
  namespaced: true,
  state: {
    books: [],
    loading: false,
    currentPage: 1,
    booksQuantity: 50,
    sortBy: "title",
    orderAsc: true,
  },
  mutations: {
    SET_BOOKS(state, books) {
      state.books = books;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
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
        console.log(bookData);

        const response = await booksService.getBooks(bookData);
        commit("SET_BOOKS", response.data);
      } catch (error) {
        console.error(error.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    updateBooks({ commit }, books) {
      commit("SET_BOOKS", books);
    },
  },
  getters: {
    getBooks: (state) => state.books,
    getLoadings: (state) => state.loading,
    getCurrentPage: (state) => state.currentPage,
    getBooksQuantity: (state) => state.booksQuantity,
    getSortBy: (state) => state.sortBy,
    getOrderAsc: (state) => state.orderAsc,
    getbooksQuantity: (state) => state.booksQuantity,
  },
};

export default books;
