import mongoose from "mongoose";
import { TErrorSources } from "../interfaces/error.types";

export const handleValidationError = (err: mongoose.Error.ValidationError) => {
    const errorSource: TErrorSources[] = [];

    const errors = Object.values(err.errors);

    errors.forEach((errorObject) => errorSource.push({
        path: errorObject.path,
        message: errorObject.message
    }));

    return{
        statusCode: 400,
        message: "validation Error",
        errorSource
    }
}