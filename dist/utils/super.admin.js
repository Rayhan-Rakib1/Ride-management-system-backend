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
exports.superAdmin = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../ErrorHandler/AppError"));
const user_model_1 = require("../modules/user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_interface_1 = require("../modules/user/user.interface");
const mongoose_1 = require("mongoose");
const superAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExist = yield user_model_1.User.findOne({
            email: env_1.envVers.SUPER_ADMIN_EMAIL,
        });
        if (isSuperAdminExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Super admin already exist");
        }
        const hashPassword = yield bcryptjs_1.default.hash(env_1.envVers.SUPER_ADMIN_PASSWORD, Number(env_1.envVers.BCRYPT_SALT_ROUND));
        const authProvider = {
            provider: "credential",
            providerId: env_1.envVers.SUPER_ADMIN_EMAIL,
        };
        const payload = {
            _id: new mongoose_1.Types.ObjectId(),
            name: "Super admin",
            email: env_1.envVers.SUPER_ADMIN_EMAIL,
            password: hashPassword,
            auth: [authProvider],
            role: user_interface_1.Role.SuperAdmin,
        };
        yield user_model_1.User.create(payload);
    }
    catch (error) {
        console.log(error);
    }
});
exports.superAdmin = superAdmin;
