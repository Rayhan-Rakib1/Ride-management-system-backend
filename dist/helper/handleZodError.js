"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerZodError = void 0;
const handlerZodError = (err) => {
    const errorSource = [];
    err.issues.forEach((issue) => {
        errorSource.push({
            path: issue.path[issue.path.length - 1],
            message: issue.message,
        });
    });
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSource,
    };
};
exports.handlerZodError = handlerZodError;
