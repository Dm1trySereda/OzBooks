import Vue from "vue";
import Vuex from "vuex";
import filters from "./filters.js";
import books from "./books.js";
import routes from "./routes.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    books,
    filters,
    routes,
  },
});
export default store;
