  import Vue from "vue";
  import Vuex from "vuex";

  Vue.use(Vuex);

  const store = new Vuex.Store({
    state: {
      books: [],
    },
    mutations: {
      setBooks(state, books) {
        state.books = books;
      },
    },
    actions: {
      updateBooks({ commit }, books) {
        commit('setBooks', books); 
      },
    },
    getters: {
      books: (state) => state.books,
    },
  });

  export default store;
