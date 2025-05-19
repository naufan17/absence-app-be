import { Request, Response } from "express";
import { userRepository } from "../../repositories/user.repository"
import { responseNotFound, responseOk, responseInternalServerError } from "../../helpers/reponse.helper";
import logger from "../../config/logger";

export const userVerifikatorController = () => {
  const allUsers = async (req: Request, res: Response) => {
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

  const updateUserVerified = async (req: Request, res: Response) => {
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
  
  return {
    allUsers,
    updateUserVerified
  }
}