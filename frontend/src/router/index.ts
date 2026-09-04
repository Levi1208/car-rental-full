import { createRouter, createWebHistory } from "vue-router";
import PublicView from "@/views/PublicView.vue";
import RentView from "@/views/RentView.vue";
import AdminView from "@/views/AdminView.vue";
import EditCarView from "@/views/EditCarView.vue";
import LoginView from "@/views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "public",
      component: PublicView,
    },
    {
      path: "/rent/:id",
      name: "rent",
      component: RentView,
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminView,
    },
    {
      path: "/admin/edit-car/:id",
      name: "edit-car",
      component: EditCarView,
    },
    {
      path: "/admin/create-car",
      name: "create-car",
      component: EditCarView,
      props: { create: true },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    /* {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    }, */
  ],
});

export default router;
