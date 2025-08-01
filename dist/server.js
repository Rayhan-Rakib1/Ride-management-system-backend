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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const env_1 = require("./config/env");
const super_admin_1 = require("./utils/super.admin");
let server;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(env_1.envVers.DB_URL);
            server = app_1.app.listen(env_1.envVers.PORT, () => {
                console.log(`server is running on port ${env_1.envVers.PORT}`);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield startServer();
    yield (0, super_admin_1.superAdmin)();
}))();
process.on("SIGINT", () => {
    console.log("server shut down");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
