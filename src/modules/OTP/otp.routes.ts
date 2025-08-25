import  express from "express"
import { OTPController } from "./otp.controller";
const router = express.Router();


router.post('/send-otp' ,OTPController.sendOTP);
router.post("/verify-otp", OTPController.verifyOTP);

export const otpRoutes = router;
