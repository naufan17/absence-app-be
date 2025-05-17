/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { userRepository } from '../repositories/user.repository';
import { responseInternalServerError, responseNotFound, responseOk } from '../helpers/reponse.helper';
import logger from '../config/logger';

export const accountController = () => {
  const profileCurentUser = async (req: Request | any, res: Response) => {
    const { user }: { user: { id: string, role: 'admin' | 'verifikator' | 'user' } } = req;

    try {
      const currentUser = await userRepository().findById(user.id);
      if (!currentUser) return responseNotFound(res, 'User not found');

      return responseOk(res, 'User found', currentUser);
    } catch (error) {
      logger.error(error);
      console.error(error);

      return responseInternalServerError(res, 'Failed to get user profile');
    }
  }

  return { 
    profileCurentUser 
  };
}