import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { userRepository } from "../../repositories/user.repository"
import { responseNotFound, responseOk, responseInternalServerError, responseBadRequest, responseConflict, responseCreated } from "../../helpers/reponse.helper";
import logger from "../../config/logger";

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

  const createNeWUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role } = req.body

    const errors = validationResult(req);
    if (!errors.isEmpty()) return responseBadRequest(res, errors.array()[0].msg);

    try {
      const existingUser = await userRepository().findByEmail(email);
      if (existingUser) return responseConflict(res, 'User already exists');

      const hashedPassword: string = await bcrypt.hash(password, 10);
      if (!hashedPassword) return responseInternalServerError(res, 'Failed to hash password');
      
      const newUser = await userRepository().createWithRole(name, email, hashedPassword, role);
      if (!newUser) return responseInternalServerError(res, 'Failed to create user');
      
      return responseCreated(res, 'User created successfully');
    } catch (error) {
      logger.error(error);
      console.error(error);

      return responseInternalServerError(res, 'Registration failed');
    }
  }

  const resetPasswordUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { password } = req.body

    const errors = validationResult(req);
    if (!errors.isEmpty()) return responseBadRequest(res, errors.array()[0].msg);

    try {
      const user = await userRepository().findById(id);
      if (!user) return responseNotFound(res, 'User not found');

      const hashedPassword: string = await bcrypt.hash(password, 10);
      if (!hashedPassword) return responseInternalServerError(res, 'Failed to hash password');
      
      const updatedUser = await userRepository().updatePassword(id, hashedPassword);
      if (!updatedUser) return responseInternalServerError(res, 'Failed to reset password');
      
      return responseOk(res, 'Password reset successfully');
    } catch (error) {
      logger.error(error);
      console.error(error);

      return responseInternalServerError(res, 'Failed to reset password');
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

  const getStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const totalCount = await userRepository().totalCount();
      const roleCounts = await userRepository().roleCounts();
      type Role = 'user' | 'verifikator'
      const countsByRole: Record<Role, number> = {
        user: 0,
        verifikator: 0
      };

      roleCounts.forEach(item => {
        countsByRole[item.role as keyof typeof countsByRole] = item._count.role;
      });

      return responseOk(res, 'Statistics found', { total: totalCount, ...countsByRole });
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to get statistics');
    }
  }
  
  return {
    allUsers,
    createNeWUser,
    resetPasswordUser,
    updateUserRole,
    getStatistics
  }
}