"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data) => {
    var _a;
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data,
        meta: (_a = data.meta) !== null && _a !== void 0 ? _a : null,
    });
};
exports.sendResponse = sendResponse;
