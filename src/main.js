import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import router from "./routers/usersRouter";
import vuetify from "./plugins/vuetify";

Vue.use(VueRouter);
Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
  el: "#app",
  router,
  vuetify,
  
});
