import dotenv from "dotenv"
import { Config } from "../types/config"

dotenv.config({ path: ".env" })

const config: Config = {
  NodeEnv: process.env.NODE_ENV || "development",
  Port: process.env.PORT || "8000",
  Host: process.env.HOST || "localhost",
  JWTSecretKey: process.env.JWT_SECRET_KEY || "secret",
  JWTExpiresIn: process.env.JWT_EXPIRES_IN || "3600000",
  CorsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  RateLimitMax: process.env.RATE_LIMIT_MAX || "100",
  RateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS || "3600000",
}

export default config