import { Router } from "express";
import passport from "passport";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/check.auth";
import { Role } from "../user/user.interface";

const router = Router();

router.post('/login', authController.credentialLogin)
router.post('/refresh-token', authController.getNewAccessToken)
router.post('/logout', authController.userLogout)
router.post('/reset-password', checkAuth(...Object.values(Role)), authController.resetPassword);
router.get('/google', (req, res, next) => {
  const redirect = req?.query?.redirect || '';
  passport.authenticate('google', {
    scope: ["profile", "email"],
    state: redirect as string,
  })(req, res, next);
});


router.get('/google/callback',passport.authenticate('google', {failureRedirect: "/login"}), authController.googleCallback)

export const authRoutes = router;