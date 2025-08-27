"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = require("./auth.controller");
const check_auth_1 = require("../../middlewares/check.auth");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post('/login', auth_controller_1.authController.credentialLogin);
router.post('/refresh-token', auth_controller_1.authController.getNewAccessToken);
router.post('/logout', auth_controller_1.authController.userLogout);
router.patch('/reset-password', (0, check_auth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.authController.resetPassword);
router.get('/google', (req, res, next) => {
    var _a;
    const redirect = ((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.redirect) || '';
    passport_1.default.authenticate('google', {
        scope: ["profile", "email"],
        state: redirect,
    })(req, res, next);
});
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: "/login" }), auth_controller_1.authController.googleCallback);
exports.authRoutes = router;
