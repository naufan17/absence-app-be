/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { userRepository } from "../repositories/user.repository";
import config from "./config";
import logger from "./logger";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (
      email: string, 
      password: string, 
      done: (error: unknown, user?: any, info?: { message: string }) => void
    ): Promise<void> => {
      try {
        const user = await userRepository().findByEmail(email);
        if (!user) return done(null, false, { message: "Incorrect email" });

        if (!user.is_verified) return done(null, false, { message: "User is not verified" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: "Incorrect password" });
        
        return done(null, user);
      } catch (error) {
        console.error(error);
        logger.error(error);

        return done(error);
      }
    }
  )
)

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWTSecretKey,
    }, async (
      payload: { sub: string, role: 'admin' | 'verifikator' | 'user' }, 
      done: (error: unknown, user?: any, info?: { message: string }) => void
    ): Promise<void> => {
      if (!payload.sub && !payload.role) return done(null, false, { message: "Access token is invalid" });

      return done(null, payload);
    }
  )
)

export default passport;