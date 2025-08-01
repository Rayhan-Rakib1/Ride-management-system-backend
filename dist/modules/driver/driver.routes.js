"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driversRoutes = void 0;
const express_1 = require("express");
const check_auth_1 = require("../../middlewares/check.auth");
const user_interface_1 = require("../user/user.interface");
const validation_request_1 = require("../../middlewares/validation.request");
const driver_validation_1 = require("./driver.validation");
const driver_controller_1 = require("./driver.controller");
const router = (0, express_1.Router)();
// Create a new driver (admin only)
router.post('/create-driver', (0, check_auth_1.checkAuth)(user_interface_1.Role.Admin, user_interface_1.Role.SuperAdmin, user_interface_1.Role.Rider, user_interface_1.Role.Driver), (0, validation_request_1.validationRequest)(driver_validation_1.createDriverZodSchema), driver_controller_1.DriverController.createDriver);
// Get all drivers (admin only)
router.get('/all-drivers', (0, check_auth_1.checkAuth)(user_interface_1.Role.Admin, user_interface_1.Role.SuperAdmin), driver_controller_1.DriverController.getAllDrivers);
// Get single driver profile (driver or admin)
router.get('/:id', (0, check_auth_1.checkAuth)(user_interface_1.Role.Driver, user_interface_1.Role.Admin, user_interface_1.Role.SuperAdmin), driver_controller_1.DriverController.getDriverById);
// Update driver approval status (admin only)
router.patch('/:id/approve', (0, check_auth_1.checkAuth)(user_interface_1.Role.Admin, user_interface_1.Role.SuperAdmin), (0, validation_request_1.validationRequest)(driver_validation_1.updateDriverZodSchema), driver_controller_1.DriverController.updateDriverStatus);
// Update driver availability (driver only)
router.patch('/:id/availability', (0, check_auth_1.checkAuth)(user_interface_1.Role.Driver), driver_controller_1.DriverController.updateDriverAvailability);
// Get driver's ride history (driver only)
router.get('/:id/ride-history', (0, check_auth_1.checkAuth)(user_interface_1.Role.Driver), driver_controller_1.DriverController.getDriverRideHistory);
// Get driver's earnings history (driver only)
router.get('/earnings/:id', (0, check_auth_1.checkAuth)(user_interface_1.Role.Driver), driver_controller_1.DriverController.getDriverEarnings);
// Accept a ride request (driver only)
router.patch('/rides/:rideId/accept', (0, check_auth_1.checkAuth)(user_interface_1.Role.Driver), driver_controller_1.DriverController.acceptRide);
// Update ride status (driver only)
router.patch('/rides/:rideId/status', (0, check_auth_1.checkAuth)(user_interface_1.Role.Driver), driver_controller_1.DriverController.updateRideStatus);
exports.driversRoutes = router;
