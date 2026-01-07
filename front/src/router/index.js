import { createRouter, createWebHistory } from "vue-router";
import SsoTablesView from "../views/SsoTablesView.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "sso-tables", component: SsoTablesView },
  ],
});
