export interface StoredFile {
  storedName: string;
  storageKey: string;
}

export interface StorageService {
  save(file: Express.Multer.File): Promise<StoredFile>;

  delete(storageKey: string): Promise<void>;
}
