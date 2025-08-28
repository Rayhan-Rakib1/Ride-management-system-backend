import { Router } from "express";
import { checkAuth } from "../../middlewares/check.auth";
import { Role } from "../user/user.interface";
import { validationRequest } from "../../middlewares/validation.request";
import { createRideZodSchema, updateRideStatusZodSchema } from "./ride.validation";
import { RideController } from "./ride.controller";

const router = Router();

// Create a new ride (rider only)
router.post(
  "/create-ride",
  checkAuth(Role.Rider),
  validationRequest(createRideZodSchema),
  RideController.createRide
);

// Get all rides (admin only)
router.get(
  "/all-rides",
  checkAuth(Role.Admin, Role.SuperAdmin, Role.Driver),
  RideController.getAllRides
);
// Cancel a ride (rider only)
router.patch(
  "/cancel/:id",
  checkAuth(Role.Rider),
  RideController.cancelRide
);

// Update ride status (driver only)
router.patch(
  "/status/:id",
  checkAuth(Role.Driver),
  validationRequest(updateRideStatusZodSchema),
  RideController.updateRideStatus
);

// Get ride by ID (rider, driver, or admin)
router.get(
  "/:id",
  checkAuth(Role.Rider, Role.Driver, Role.Admin, Role.SuperAdmin),
  RideController.getRideById
);





export const ridesRoutes = router;