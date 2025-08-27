import express from "express";
import { checkAuth } from "../../middlewares/check.auth";
import { Role } from "../user/user.interface";
import { PaymentController } from "./payment.controller";
const router = express.Router();


router.post('/init-payment/:rideId',   PaymentController.initPayment)
router.post('/success', PaymentController.successPayment)
router.post('/fail', PaymentController.failPayment)
router.post('/cancel', PaymentController.cancelPayment)
router.post("/validate-payment", PaymentController.validatePayment)
router.get('/:paymentId', checkAuth(Role.Rider, Role.Driver, Role.SuperAdmin))

export const paymentRoutes = router;