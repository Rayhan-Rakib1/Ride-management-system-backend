"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../modules/user/user.model");
const env_1 = require("./env");
const user_interface_1 = require("../modules/user/user.interface");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email", // ✅ Your login form should send 'email'
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isUserExist = yield user_model_1.User.findOne({ email });
        if (!isUserExist) {
            return done(null, false, { message: "User does not exist" });
        }
        const googleAuthenticated = (_a = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.auth) === null || _a === void 0 ? void 0 : _a.some((providerObjects) => providerObjects.provider === "google");
        if (!googleAuthenticated && !isUserExist.password) {
            return done(null, false, {
                message: "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.",
            });
        }
        if (!isUserExist.password) {
            return done(null, false, {
                message: "No password set. Please login with Google first.",
            });
        }
        const passwordMatched = yield bcryptjs_1.default.compare(password, isUserExist.password);
        if (!passwordMatched) {
            return done(null, false, { message: "Password does not match" });
        }
        if (!isUserExist.isVerified) {
            return done(null, false, { message: "User is not verified" });
        }
        return done(null, isUserExist); // success
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        if (!email) {
            return done(null, false, { message: "Email not found" });
        }
        const user = yield user_model_1.User.findOne({ email });
        // 🔍 If no user with the email exists
        if (!user) {
            // ✅ Check if this is the very first user in the DB
            const totalUsers = yield user_model_1.User.countDocuments();
            const newUser = yield user_model_1.User.create({
                email,
                name: profile.displayName,
                picture: (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
                isVerified: true,
                role: totalUsers === 0 ? user_interface_1.Role.SuperAdmin : user_interface_1.Role.Rider, // ✅ Conditionally assign role
                auths: [
                    {
                        provider: "google",
                        providerId: profile.id,
                    },
                ],
            });
            return done(null, newUser);
        }
        // ✅ If user already exists, return that
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
