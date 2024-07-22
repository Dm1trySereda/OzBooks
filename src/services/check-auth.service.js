import localStorageService from "@/services/local-storage.service.js";

function checkAuthentication(to, from, next) {
  // Если токен не найден - значит была получена ошибка 403 (пользователь не аутентифицирован)
  const isAuthenticated = !!localStorageService.getToken();
  // Проверка, требует ли маршрут аутентификации
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    // Если маршрут требует аутентификации и пользователь не аутентифицирован,
    // перенаправляем его на страницу логина с параметром redirect, чтобы вернуть пользователя обратно после логина
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
    // Если маршрут не требует аутентификации или пользователь аутентифицирован,
    // позволяем продолжить переход на запрашиваемую страницу
  } else if (
    to.matched.some((record) => record.meta.guestOnly) &&
    isAuthenticated
  ) {
    next({
      path: "/home",
    });
  } else {
    next();
  }
}

export default checkAuthentication;
