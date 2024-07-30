import booksService from "@/services/books.service.js";

const filters = {
  namespaced: true,
  state: {
    popularAuthors: [],
    publishingYears: [],
    selectedAuthors: [],
    selectedYears: [],
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
    async loadPublishingYears({ state, commit }) {
      try {
        if (state.selectedAuthors.length == 0) {
          const count = { count: 30 };
          const response = await booksService.getPublishingYears(count);
          commit("SET_PUBLISHING_YEARS", response.data);
        }
      } catch (error) {
        console.error("Failed to load popular publishing year:", error);
      }
    },
    async loadFilteringsBooks({ state, commit, dispatch }) {
      try {
        const filters = {};
        if (state.selectedAuthors.length > 0) {
          filters.authors = cleanedFilters(state.selectedAuthors);
        }

        if (state.selectedYears.length > 0) {
          filters.years = cleanedFilters(state.selectedYears);
        }
        if (Object.keys(filters).length > 0) {
          await dispatch("books/fetchBooks", filters, { root: true });
          const response = await booksService.searchBooks(filters);
          commit("SET_SEARHCERBLE_BOOKS", response.data.length);
          if (filters.authors) {
            const years = countYears(response.data.map((book) => book.year));
            commit("SET_PUBLISHING_YEARS", years);
          }
        } else {
          await dispatch("books/fetchBooks", {}, { root: true });
        }
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
    getFilteredBooks: (state) => state.filteredBooks,
    getSearchebleBooks: (state) => state.searchableBooks,
  },
};
function cleanedFilters(array) {
  const cleanedArray = array
    .map((value) => {
      if (typeof value === "object" && value !== null) {
        return value.author || value.years || "";
      }
      return value;
    })
    .filter((value) => {
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      if (typeof value === "number") {
        return !isNaN(value);
      }
      return false;
    });
  return cleanedArray;
}
function countYears(yearsArray) {
  const yearsCount = {};
  yearsArray.forEach((year) => {
    yearsCount[year] = (yearsCount[year] || 0) + 1;
  });
  const resultArray = Object.entries(yearsCount).map(([year, count]) => {
    return { year: parseInt(year), count: count };
  });

  return resultArray;
}
export default filters;
