import LoginForm from "@/views/LoginForm.vue";
const loginRouter = [
  { title:'Авторизация и регистрация',
    path: "/login",
    name: "login",
    meta: {
      guestOnly: true,
    },
    component: LoginForm,
  },
];

export default loginRouter;
