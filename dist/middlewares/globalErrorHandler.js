"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../ErrorHandler/AppError"));
const handleDuplicateError_1 = require("../helper/handleDuplicateError");
const handleCastError_1 = require("../helper/handleCastError");
const handleZodError_1 = require("../helper/handleZodError");
const handleValidationError_1 = require("../helper/handleValidationError");
const globalErrorHandler = (err, req, res) => {
    if (env_1.envVers.NODE_ENV === "development") {
        console.log(err);
    }
    let statusCode = 500;
    let message = `Something went wrong @{err.massage} from global error handler`;
    let errorSources = [];
    if (err.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.handlerDuplicateError)(err);
        message = simplifiedError.message;
        statusCode = simplifiedError.statusCode;
    }
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.handleCastError)(err);
        message = simplifiedError.message;
        statusCode = simplifiedError.statusCode;
    }
    else if (err.name === "ZodError") {
        const simplifiedError = (0, handleZodError_1.handlerZodError)(err);
        message = simplifiedError.message;
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSource;
    }
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.handleValidationError)(err);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSource;
        message = simplifiedError.message;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: env_1.envVers.NODE_ENV === 'development' ? err : null,
        stack: env_1.envVers.NODE_ENV === "development" ? err.stack : null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
