/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { TErrorSources } from "../interfaces/error.types";
import AppError from "../ErrorHandler/AppError";
import { handlerDuplicateError } from "../helper/handleDuplicateError";
import { handleCastError } from "../helper/handleCastError";
import { handlerZodError } from "../helper/handleZodError";
import { handleValidationError } from "../helper/handleValidationError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.log(err);
  }
  let statusCode = 500;
  let message = `Something went wrong @{err.massage} from global error handler`;

  let errorSources: any = [];
  if (err.code === 11000) {
    const simplifiedError = handlerDuplicateError(err);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
  } else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
  } else if (err.name === "ZodError") {
    const simplifiedError = handlerZodError(err);
    message = simplifiedError.message;
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSource as TErrorSources[];
  } else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSource as TErrorSources[];
    message = simplifiedError.message;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
