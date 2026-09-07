import { AppError } from "./AppError.js";

export class ConflictError extends AppError {
  constructor(message = "the item is already in the system") {
    super(message, 409);
  }
}
