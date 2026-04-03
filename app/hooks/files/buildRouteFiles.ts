export const BASE_URL = "http://172.20.10.2:3000";

export const buildFileUrl = (relativePath: string) => {
  if (!relativePath) return "";
  return `${BASE_URL}/${relativePath}`;
};
