import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify/lib";
import vuetify from "./plugins/vuetify";
import Vuex from "vuex";
import router from "./router/router.js";
import store from "./store/store.js";
import "./main.css";

import "vuetify/dist/vuetify.min.css";

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(Vuex);
new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
