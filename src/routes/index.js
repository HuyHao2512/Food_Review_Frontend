import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/AuthPage/LoginPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
  {
    path: "/login",
    page: LoginPage,
  },
];
