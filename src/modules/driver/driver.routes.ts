import { Router } from "express";
import { checkAuth } from "../../middlewares/check.auth";
import { Role } from "../user/user.interface";
import { validationRequest } from "../../middlewares/validation.request";
import { createDriverZodSchema,  updateDriverZodSchema } from "./driver.validation";
import { DriverController } from "./driver.controller";

const router = Router();

// Create a new driver (admin only)
router.post(
  '/create-driver',
  checkAuth(Role.Admin, Role.SuperAdmin, Role.Rider, Role.Driver),
  validationRequest(createDriverZodSchema),
  DriverController.createDriver
);

// Get all drivers (admin only)
router.get(
  '/all-drivers',
  checkAuth(Role.Admin, Role.SuperAdmin),
  DriverController.getAllDrivers
);

// Get single driver profile (driver or admin)
router.get(
  '/:id',
  checkAuth(Role.Driver, Role.Admin, Role.SuperAdmin),
  DriverController.getDriverById
);


// Update driver approval status (admin only)
router.patch(
  '/:id/approve',
  checkAuth(Role.Admin, Role.SuperAdmin),
  validationRequest(updateDriverZodSchema),
  DriverController.updateDriverStatus
);

// Update driver availability (driver only)
router.patch(
  '/:id/availability',
  checkAuth(Role.Driver),
  DriverController.updateDriverAvailability
);



// Get driver's ride history (driver only)
router.get(
  '/:id/ride-history',
  checkAuth(Role.Driver),
  DriverController.getDriverRideHistory
);

// Get driver's earnings history (driver only)
router.get(
  '/earnings/:id',
  checkAuth(Role.Driver),
  DriverController.getDriverEarnings
);

// Accept a ride request (driver only)
router.patch(
  '/rides/:rideId/accept',
  checkAuth(Role.Driver),
  DriverController.acceptRide
);

// Update ride status (driver only)
router.patch(
  '/rides/:rideId/status',
  checkAuth(Role.Driver),
  DriverController.updateRideStatus
);

export const driversRoutes = router;