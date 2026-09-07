export const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
];
export function isAllowedMimeType(mimeType: string): boolean {
  return allowedMimeTypes.includes(mimeType);
}
