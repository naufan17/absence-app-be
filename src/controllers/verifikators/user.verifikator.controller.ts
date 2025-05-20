import { Request, Response } from "express";
import { userRepository } from "../../repositories/user.repository"
import { responseNotFound, responseOk, responseInternalServerError } from "../../helpers/reponse.helper";
import logger from "../../config/logger";

export const userVerifikatorController = () => {
  const allUsers = async (req: Request, res: Response): Promise<void> => {
    const { isVerified }: { isVerified?: string } = req.query; 
    let isVerifiedBool: boolean | undefined = undefined;
    
    if (typeof isVerified === 'string') {
      if (isVerified.toLowerCase() === 'true') isVerifiedBool = true;
      else if (isVerified.toLowerCase() === 'false') isVerifiedBool = false;
    }

    try {
      const users = await userRepository().findAllWithVerified(isVerifiedBool);
      if (users.length === 0) return responseNotFound(res, 'Users not found');

      return responseOk(res, 'Users found', users);
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to get users');
    }
  }

  const updateUserVerified = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const user = await userRepository().findById(id);
      if (!user) return responseNotFound(res, 'User not found');
      if (user.is_verified) return responseOk(res, 'User already verified');

      const updatedUser = await userRepository().updateVerified(id);
      if (!updatedUser) return responseInternalServerError(res, 'Failed to update user verified');

      return responseOk(res, 'User verified updated');
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to update user verified');
    }
  }

    const getStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const totalCount = await userRepository().totalCount();
      const verifiedCounts = await userRepository().verifiedCounts();
      const countsByVerified: Record<'isVerified' | 'notVerified', number> = {
        isVerified: 0,
        notVerified: 0
      };

      verifiedCounts.forEach(item => {
        const key = item.is_verified ? 'isVerified' : 'notVerified';
        countsByVerified[key] = item._count.is_verified;
      });

      return responseOk(res, 'Statistics found', { total: totalCount, ...countsByVerified });
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to get statistics');
    }
  }
  
  return {
    allUsers,
    updateUserVerified,
    getStatistics
  }
}