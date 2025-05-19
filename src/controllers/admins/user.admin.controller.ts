import { Request, Response } from "express";
import { userRepository } from "../../repositories/user.repository"
import { responseNotFound, responseOk, responseInternalServerError, responseBadRequest } from "../../helpers/reponse.helper";
import logger from "../../config/logger";
import { validationResult } from "express-validator";

export const userAdminController = () => {
  const allUsers = async (req: Request, res: Response): Promise<void> => {
    const { role }: { role?: 'verifikator' | 'user' } = req.query;

    try {
      const users = await userRepository().findAllWithRole(role);
      if (users.length === 0) return responseNotFound(res, 'Users not found');

      return responseOk(res, 'Users found', users);
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to get users');
    }
  }
  
  const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { role } = req.body

    const errors = validationResult(req);
    if (!errors.isEmpty()) return responseBadRequest(res, errors.array()[0].msg);

    try {
      const user = await userRepository().findById(id);
      if (!user) return responseNotFound(res, 'User not found');

      const updatedUser = await userRepository().updateRole(id, role);
      if (!updatedUser) return responseInternalServerError(res, 'Failed to update user role');

      return responseOk(res, 'User role updated');
    } catch (error) {
      logger.error(error);
      console.error(error);

      return responseInternalServerError(res, 'Failed to update user role');
    }
  }
  
  return {
    allUsers,
    updateUserRole
  }
}