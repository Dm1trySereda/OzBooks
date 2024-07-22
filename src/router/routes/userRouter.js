import AboutMePage from "@/views/AboutMePage.vue";
import GoogleRedirect from "@/views/GoogleRedirectPage.vue";

const userRouter = [
  {
    path: "my-profile",
    name: "my-profile",
    meta: {
      requiresAuth: true,
    },
    component: AboutMePage,
    
  },
  {
    path: "google-user-content",
    name: "google-redirect",
    component: GoogleRedirect,
  },
];

export default userRouter;
