"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ridesRoutes = void 0;
const express_1 = require("express");
const check_auth_1 = require("../../middlewares/check.auth");
const user_interface_1 = require("../user/user.interface");
const validation_request_1 = require("../../middlewares/validation.request");
const ride_validation_1 = require("./ride.validation");
const ride_controller_1 = require("./ride.controller");
const router = (0, express_1.Router)();
// Create a new ride (rider only)
router.post("/create-ride", (0, check_auth_1.checkAuth)(user_interface_1.Role.Rider), (0, validation_request_1.validationRequest)(ride_validation_1.createRideZodSchema), ride_controller_1.RideController.createRide);
// Get all rides (admin only)
router.get("/all-rides", (0, check_auth_1.checkAuth)(user_interface_1.Role.Admin, user_interface_1.Role.SuperAdmin), ride_controller_1.RideController.getAllRides);
// Cancel a ride (rider only)
router.patch("/cancel/:id", (0, check_auth_1.checkAuth)(user_interface_1.Role.Rider), ride_controller_1.RideController.cancelRide);
// Update ride status (driver only)
router.patch("/status/:id", (0, check_auth_1.checkAuth)(user_interface_1.Role.Driver), (0, validation_request_1.validationRequest)(ride_validation_1.updateRideStatusZodSchema), ride_controller_1.RideController.updateRideStatus);
// Get ride by ID (rider, driver, or admin)
router.get("/:id", (0, check_auth_1.checkAuth)(user_interface_1.Role.Rider, user_interface_1.Role.Driver, user_interface_1.Role.Admin, user_interface_1.Role.SuperAdmin), ride_controller_1.RideController.getRideById);
exports.ridesRoutes = router;
