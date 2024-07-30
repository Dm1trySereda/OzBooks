import VueRouter from "vue-router";
import NotFound404 from "@/views/404NotFoundPage.vue";
import HomePage from "@/views/HomePage.vue";
import loginRouter from "./routes/loginRouter";
import userRouter from "./routes/userRouter";
import checkAuthentication from "@/services/check-auth.service.js";
import MainView from "../views/MainView.vue";
const routes = [
  ...loginRouter,
  {
    path: "/",
    redirect: "/home",
    component: MainView,
    children: [
      {
        title: "Главная страница без фильтров",
        path: "/home",
        name: "home",
        component: HomePage,
      },
      {
        title: "Главная страница с фильтрами",
        path: "/home//",
        name: "home-page",
        component: HomePage,
      },
      ...userRouter,
    ],
  },
  { title: "Страница не найдена", path: "*", component: NotFound404 },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  checkAuthentication(to, from, next);
  router.app.$store.dispatch("routes/updateHistoryRoute", from);
});
export default router;
