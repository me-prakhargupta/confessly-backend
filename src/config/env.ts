import "dotenv/config";
import type { StringValue } from "ms";

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

/* PORT must be a number for app.listen */
const rawPort = requireEnv("PORT");
const portNumber = Number(rawPort);

if (Number.isNaN(portNumber)) {
  throw new Error("PORT must be a valid number");
}

export const PORT: number = portNumber;

/* Database */
export const MONGO_URI: string = requireEnv("MONGO_URI");
export const DB_NAME: string = requireEnv("DB_NAME");

/* Access token */
export const ACCESS_TOKEN_SECRET: string = requireEnv("ACCESS_TOKEN_SECRET");
export const ACCESS_TOKEN_EXPIRY = requireEnv("ACCESS_TOKEN_EXPIRY") as StringValue;

/* Refresh token */
export const REFRESH_TOKEN_SECRET: string = requireEnv("REFRESH_TOKEN_SECRET");
export const REFRESH_TOKEN_EXPIRY = requireEnv("REFRESH_TOKEN_EXPIRY") as StringValue;
