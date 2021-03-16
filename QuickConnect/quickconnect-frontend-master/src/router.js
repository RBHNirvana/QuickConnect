import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Registration from "./views/Registration.vue";
import UserFeed from "./views/UserFeed.vue";
import CreateService from "./views/CreateService.vue";
import Service from "./views/Service.vue";
import Inbox from "./views/Inbox.vue";
import ServiceInbox from "./views/ServiceInbox.vue";


Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login
    },
    {
      path: "/register",
      name: "Registration",
      component: Registration
    },
    {
      path: "/feed",
      name: "UserFeed",
      component: UserFeed
    },
    {
      path: "/inbox",
      name: "Inbox",
      component: Inbox
    },
    {
      path: "/service",
      name: "Service",
      component: Service
    },
    {
      path: "/service-inbox",
      name: "ServiceInbox",
      component: ServiceInbox
    },
    {
      path: "/create-service",
      name: "CreateService",
      component: CreateService
    },
  ]
});
