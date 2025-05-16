export interface Config {
  NodeEnv: string;
  Port: string;
  Host: string;
  JWTSecretKey: string;
  JWTExpiresIn: string;
  CorsOrigin: string;
  RateLimitMax: string;
  RateLimitWindowMs: string;
}