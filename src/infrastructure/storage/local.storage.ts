import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import type { StorageService, StoredFile } from "./storage.types.js";

export class LocalStorage implements StorageService {
  private readonly uploadDirectory = path.resolve("uploads/files");

  async save(file: Express.Multer.File): Promise<StoredFile> {
    await fs.mkdir(this.uploadDirectory, {
      recursive: true,
    });

    const extension = path.extname(file.originalname);

    const storedName = `${crypto.randomUUID()}${extension}`;

    const filePath = path.join(this.uploadDirectory, storedName);

    await fs.writeFile(filePath, file.buffer);

    return {
      storedName,

      storageKey: `files/${storedName}`,
    };
  }

  async delete(storageKey: string): Promise<void> {
    const fileName = path.basename(storageKey);

    const filePath = path.join(this.uploadDirectory, fileName);

    await fs.unlink(filePath);
  }
}
