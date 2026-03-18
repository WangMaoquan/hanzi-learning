import { registerAs } from "@nestjs/config";
import { LoggingConfig } from "./logging.config";

export const appConfig = registerAs("app", () => ({
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
  ],
}));

export const databaseConfig = registerAs("database", () => ({
  url: process.env.DATABASE_URL || "",
}));

export const cacheConfig = registerAs("cache", () => ({
  ttl: parseInt(process.env.CACHE_TTL || "60000", 10),
}));

export const throttleConfig = registerAs("throttle", () => ({
  short: {
    ttl: parseInt(process.env.THROTTLE_SHORT_TTL || "1000", 10),
    limit: parseInt(process.env.THROTTLE_SHORT_LIMIT || "10", 10),
  },
  medium: {
    ttl: parseInt(process.env.THROTTLE_MEDIUM_TTL || "10000", 10),
    limit: parseInt(process.env.THROTTLE_MEDIUM_LIMIT || "50", 10),
  },
  long: {
    ttl: parseInt(process.env.THROTTLE_LONG_TTL || "60000", 10),
    limit: parseInt(process.env.THROTTLE_LONG_LIMIT || "200", 10),
  },
}));

export const logConfig = registerAs("log", () => ({
  level: process.env.LOG_LEVEL || "info",
}));

export { LoggingConfig };
