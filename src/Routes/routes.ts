import { Router } from "express";
import { usersRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { ridesRoutes } from "../modules/ride/ride.routes";
import { driversRoutes } from "../modules/driver/driver.routes";
import { paymentRoutes } from "../modules/payment/payment.routes";
import { otpRoutes } from "../modules/OTP/otp.routes";
import { riderRoutes } from "../modules/Rider/rider.routes";

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
  { path: "/driver", route: driversRoutes },
  { path: "/rider", route: riderRoutes },
  { path: "/payment", route: paymentRoutes },
  { path: "/otp", route: otpRoutes },
];

modulesRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
