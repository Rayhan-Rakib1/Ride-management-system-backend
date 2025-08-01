"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const ride_routes_1 = require("../modules/ride/ride.routes");
const driver_routes_1 = require("../modules/driver/driver.routes");
exports.router = (0, express_1.Router)();
const modulesRoutes = [
    {
        path: "/users",
        route: user_routes_1.usersRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.authRoutes,
    },
    {
        path: "/rides",
        route: ride_routes_1.ridesRoutes,
    },
    { path: "/drivers", route: driver_routes_1.driversRoutes },
];
modulesRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
