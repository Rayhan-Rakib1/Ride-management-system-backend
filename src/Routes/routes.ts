import { Router } from "express";
import { usersRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { ridesRoutes } from "../modules/ride/ride.routes";
import { driversRoutes } from "../modules/driver/driver.routes";

export const router = Router();

const modulesRoutes = [
  {
    path: "/users",
    route: usersRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/rides",
    route: ridesRoutes,
  },
  { path: "/drivers", route: driversRoutes },
];

modulesRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
