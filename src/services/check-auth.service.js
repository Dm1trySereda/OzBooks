import localStorageService from "@/services/local-storage.service.js";
import router from "../router/router.js";

function checkAuthentication(to, from, next) {
  // Если токен не найден - значит была получена ошибка 403 (пользователь не аутентифицирован)
  const isAuthenticated =
    !!localStorageService.getToken() ||
    !!localStorageService.getGoogleAccessToken();
  // Проверка, требует ли маршрут аутентификации
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    // Если маршрут требует аутентификации и пользователь не аутентифицирован,
    // перенаправляем его на страницу логина с параметром redirect, чтобы вернуть пользователя обратно после логина
    next({
      name: "login",
      query: { redirect: to.fullPath },
    });
    // Если маршрут не требует аутентификации или пользователь аутентифицирован,
    // позволяем продолжить переход на запрашиваемую страницу
  } else {
    // Проверка на неправильную навигацию
    if (to.path === "/undefined") {
      if (router.currentRoute.name !== "home") {
        router.replace({ name: "home" });
      }
    } else {
      next();
    }
  }
}

export default checkAuthentication;
