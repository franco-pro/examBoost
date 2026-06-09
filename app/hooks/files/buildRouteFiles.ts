//to do

import { BASE_URL } from "@/app/api/apiClient";

export const BASE_URL_PORT = `${BASE_URL}:3000`;

export const buildFileUrl = (relativePath: string) => {
  if (!relativePath) return "";
  return `${BASE_URL_PORT}/${relativePath}`;
};
