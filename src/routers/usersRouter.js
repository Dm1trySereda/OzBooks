import VueRouter from "vue-router";
import NotFound404 from "@/views/404NotFound.vue";
import LoginForm from "@/views/LoginForm.vue";
import HomePage from "@/views/HomePage.vue";

export default new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/login",
      name: "login",
      component: LoginForm,
    },
    {
      path: "*",
      component: NotFound404,
    },
  ],
});
