const routesStorage = {
  namespaced: true,
  state: {
    historyRoute: [],
  },
  mutations: {
    SET_CURRENT_ROUTE(state, route) {
      state.historyRoute.push(route);
    },
    REMOVE_LAST_ROUTE(state) {
      state.historyRoute.pop();
    },
    CLEAR_HISTORY_ROUTE(state) {
      state.historyRoute = [];
    },
  },
  actions: {
    updateHistoryRoute({ state, commit }, route) {
      if (state.historyRoute.length != 5) {
        commit("SET_CURRENT_ROUTE", route);
      } else {
        commit("CLEAR_HISTORY_ROUTE");
        commit("SET_CURRENT_ROUTE", route);
      }
    },
    removeLastRoute({ commit }) {
      commit("REMOVE_LAST_ROUTE");
    },
  },
  getters: {
    getHistoryRoute: (state) => state.historyRoute,
  },
};

export default routesStorage;
