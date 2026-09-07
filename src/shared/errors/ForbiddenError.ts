import { AppError } from "./AppError.js";

export class ForbiddenError extends AppError{
    constructor(message="you are not allowed for this action"){
        super(message,403)
    }
}