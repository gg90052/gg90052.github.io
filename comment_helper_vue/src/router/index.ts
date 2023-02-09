import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import BlankTemplate from '@/components/Layout/BlankTemplate.vue';
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: () =>
      import(/* webpackChunkName: "live" */ "../views/Index.vue"),
  },
  {
    path: "/import",
    name: "Import",
    component: () =>
      import(/* webpackChunkName: "live" */ "../views/ImportIndex.vue"),
  },
  { 
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: BlankTemplate,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// router.beforeEach((to, from, next) => {
//   const noNeedLogin = to.matched.some((record) => record.meta.noNeedLogin);
//   if (noNeedLogin) {
//     next();
//   } else {
//     if (localStorage.getItem("token") == null) {
//       next({
//         path: "/login",
//         params: { nextUrl: to.fullPath },
//       });
//     } else {
//       next();
//     }
//   }
// });

export default router;
