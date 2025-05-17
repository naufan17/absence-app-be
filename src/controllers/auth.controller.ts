import bcrypt from "bcryptjs";
import passport from "passport";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { responseBadRequest, responseConflict, responseCreated, responseInternalServerError, responseOk, responseUnauthorized } from "../helpers/reponse.helper";
import { userRepository } from "../repositories/user.repository";
import { AccessToken } from "../types/token";
import { generateJWTAccess } from "../utils/jwt";
import logger from "../config/logger";

export const authController = () => {
  const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body

    const errors = validationResult(req);
    if (!errors.isEmpty()) return responseBadRequest(res, errors.array()[0].msg);

    try {
      const existingUser = await userRepository().findByEmail(email);
      if (existingUser) return responseConflict(res, 'User already exists');

      const hashedPassword: string = await bcrypt.hash(password, 10);
      if (!hashedPassword) return responseInternalServerError(res, 'Failed to hash password');
      
      const newUser = await userRepository().create(name, email, hashedPassword);
      if (!newUser) return responseInternalServerError(res, 'Failed to create user');
      
      return responseCreated(res, 'User created successfully');
    } catch (error) {
      logger.error(error);
      console.error(error);

      return responseInternalServerError(res, 'Registration failed');
    }
  }

  const login = (req: Request, res: Response): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return responseBadRequest(res, errors.array()[0].msg);

    passport.authenticate('local', { session: false }, (err: Error, user: { id: string, role: 'admin' | 'verifikator' | 'user' }, info?: { message: string }) => {
      if (err || !user) return responseUnauthorized(res, info?.message || 'Incorrect email or password');

      const accessToken: AccessToken = generateJWTAccess({ sub: user.id, role: user.role });

      return responseOk(res, 'Login successful', accessToken);
    })(req, res);
  }

  return {
    register,
    login
  }
}