import { AppError } from "./AppError.js";

export class NoteFoundError extends AppError {
  constructor(message = "note found") {
    super(message, 404);
  }
}
