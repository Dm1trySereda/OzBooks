import LoginForm from "@/views/LoginForm.vue";
const loginRouter = [
  {
    path: "/login",
    name: "login",
    meta: {
      guestOnly: true,
    },
    component: LoginForm,
  },
];

export default loginRouter;
