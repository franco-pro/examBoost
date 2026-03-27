export const BASE_URL = "http://192.168.1.101:3000";

export const buildFileUrl = (relativePath: string) => {
  if (!relativePath) return "";
  return `${BASE_URL}/${relativePath}`;
};
