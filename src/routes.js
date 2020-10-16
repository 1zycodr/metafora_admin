/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
// import Profile from "views/examples/Profile.js";
// import Maps from "views/examples/Maps.js";
// import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
// import Tables from "views/examples/Tables.js";
// import Icons from "views/examples/Icons.js";
import Managers from "views/examples/Managers.js"
import Settings from "views/examples/Settings.js"
import Groups from "views/examples/Groups.js"
import MessagesPage from "components/MessagesPage/MessagesPage"

var routes = [
  {
    path: "/index",
    name: "Главная",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin"
  },
  // {
  //   path: "/icons",
  //   name: "Иконки",
  //   icon: "ni ni-planet text-blue",
  //   component: Icons,
  //   layout: "/admin"
  // },
  // {
  //   path: "/maps",
  //   name: "Карта",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: Maps,
  //   layout: "/admin"
  // },
  // {
  //   path: "/user-profile",
  //   name: "Профиль",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: Profile,
  //   layout: "/admin"
  // },
  // {
  //   path: "/tables",
  //   name: "Таблицы",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: Tables,
  //   layout: "/admin"
  // },
  {
    path: "/login",
    name: "Авторизация",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  // {
  //   path: "/register",
  //   name: "Регистрация",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: Register,
  //   layout: "/auth"
  // },
  {
    path: "/managers",
    name: "Менеджеры",
    icon: "ni ni-badge text-blue",
    component: Managers,
    layout: "/admin"
  },
  {
    path: "/groups",
    name: "Группы",
    icon: "ni ni-badge text-orange",
    component: Groups,
    layout: "/admin"
  },
  {
    path: "/message",
    name: "Сообщения",
    icon: "ni ni-email-83",
    component: MessagesPage,
    layout: "/admin"
  },
  {
    path: "/settings",
    name: "Настройки",
    icon: "ni ni-settings",
    component: Settings,
    layout: "/admin"
  }
  
  // Сообщения
  // Менеджеры
  // Группы рассылок
  // Настройки
];
export default routes;
