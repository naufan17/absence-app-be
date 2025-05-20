/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { userRepository } from '../repositories/user.repository';
import { responseBadRequest, responseInternalServerError, responseNotFound, responseOk } from '../helpers/reponse.helper';
import logger from '../config/logger';
import { validationResult } from 'express-validator';

export const accountController = () => {
  const profileCurentUser = async (req: Request | any, res: Response): Promise<void> => {
    const { user }: { user: { sub: string, role: 'admin' | 'verifikator' | 'user' } } = req;

    try {
      const currentUser = await userRepository().findById(user.sub);
      if (!currentUser) return responseNotFound(res, 'User not found');

      return responseOk(res, 'User found', currentUser);
    } catch (error) {
      logger.error(error);
      console.error(error);

      return responseInternalServerError(res, 'Failed to get user profile');
    }
  }

  const updateProfile = async (req: Request | any, res: Response): Promise<void> => {
    const { user }: { user: { sub: string, role: 'admin' | 'verifikator' | 'user' } } = req;
    const { name, email } = req.body;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) return responseBadRequest(res, errors.array()[0].msg);

    try {
      const currentUser = await userRepository().findById(user.sub);
      if (!currentUser) return responseNotFound(res, 'User not found');

      const updatedUser = await userRepository().updateProfile(user.sub, name, email);
      if (!updatedUser) return responseInternalServerError(res, 'Failed to update profile');

      return responseOk(res, 'Profile updated');
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to update profile');
    }
  }
  const updatePassword = async (req: Request | any, res: Response): Promise<void> => {
    const { user }: { user: { sub: string, role: 'admin' | 'verifikator' | 'user' } } = req;
    const { password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) return responseBadRequest(res, errors.array()[0].msg);

    try {
      const currentUser = await userRepository().findById(user.sub);
      if (!currentUser) return responseNotFound(res, 'User not found');

      const updatedUser = await userRepository().updatePassword(user.sub, password);
      if (!updatedUser) return responseInternalServerError(res, 'Failed to update password');

      return responseOk(res, 'Password updated');
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to update password');
    }
  }

  return { 
    profileCurentUser,
    updateProfile,
    updatePassword
  };
}