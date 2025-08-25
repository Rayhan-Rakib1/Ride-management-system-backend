import express from "express";

import { RiderController } from "./rider.controller";

const router = express.Router();

// rider register
router.post("/create-rider", RiderController.createRider);
// admin only
router.get("/all-rider", RiderController.getAllRiders);
// rider only access
router.get("/me", RiderController.getRiderProfile);
// rider only update own profile
router.put("/me", RiderController.updateRiderProfile);
// rider only
router.get("/me/history", RiderController.getRiderHistory);
// admin and rider
router.get("/:id", RiderController.getRiderById);
// Delete account Driver only
router.delete("/me", RiderController.deleteRiderAccountMe);

router.delete("/:id", RiderController.deleteRiderAccountById);

export const riderRoutes = router;
