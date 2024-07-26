import booksService from "@/services/books.service.js";

const filters = {
  namespaced: true,
  state: {
    popularAuthors: [],
    publishingYears: [],
    selectedAuthors: [],
    selectedYears: [],
    selectedRemainingYears: [],
    searchableBooks: [],
  },
  mutations: {
    SET_POPULAR_AUTHOR(state, authors) {
      state.popularAuthors = authors;
    },
    SET_PUBLISHING_YEARS(state, years) {
      state.publishingYears = years;
    },
    SET_SELECTED_AUTHORS(state, authors) {
      state.selectedAuthors = authors;
    },
    SET_SELECTED_YEARS(state, years) {
      state.selectedYears = years;
    },
    SET_SELECTED_REMAINING_YEARS(state, years) {
      state.selectedRemainingYears = years;
    },
    SET_SEARHCERBLE_BOOKS(state, booksList) {
      state.searchableBooks = booksList;
    },
  },
  actions: {
    async loadPopularAuthors({ commit }) {
      try {
        const count = { count: 5000 };
        const response = await booksService.getMostPopularauthors(count);
        commit("SET_POPULAR_AUTHOR", response.data);
      } catch (error) {
        console.error("Failed to load popular authors:", error);
      }
    },
    async loadPublishingYears({ commit }) {
      try {
        const count = { count: 30 };
        const response = await booksService.getPublishingYears(count);
        commit("SET_PUBLISHING_YEARS", response.data);
      } catch (error) {
        console.error("Failed to load popular publishing year:", error);
      }
    },
    async loadFilteringsBooks({ state,commit, dispatch }) {
      try {
        // Очищаем список авторов от ненужных свойств
        const cleanedAuthors = state.selectedAuthors
          .map((author) => {
            if (typeof author === "object" && author !== null) {
              return author.author || "";
            }
            return author || "";
          })
          .filter(
            (author) => typeof author === "string" && author.trim() !== ""
          );
        const filters = {
          authors: cleanedAuthors,
        };
        await dispatch("books/fetchBooks", filters, { root: true });
        const response = await booksService.searchBooks(filters);
        console.log(response.data);
        commit("SET_SEARHCERBLE_BOOKS", response.data.length);
      } catch (error) {
        console.error("Failed to load filtered books:", error);
      }
    },
  },
  getters: {
    getPopularAuthors: (state) => state.popularAuthors,
    getPublishingYears: (state) => state.publishingYears,
    getSelectedAuthors: (state) => state.selectedAuthors,
    getSelectedYears: (state) => state.selectedYears,
    getSelectedRemainingYears: (state) => state.selectedRemainingYears,
    getFilteredBooks: (state) => state.filteredBooks,
    getSearchebleBooks: (state) => state.searchableBooks,
  },
};

export default filters;
