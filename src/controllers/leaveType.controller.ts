import { Request, Response } from "express";
import { leaveTypeRepository } from "../repositories/leaveType.repository";
import { responseInternalServerError, responseNotFound, responseOk } from "../helpers/reponse.helper";
import logger from "../config/logger";

export const leaveTypeController = () => {
  const allLeaveTypes = async (req: Request, res: Response) => {
    try {
      const leaveTypes = await leaveTypeRepository().findAll();
      if (leaveTypes.length === 0) return responseNotFound(res, 'Leave types not found');

      return responseOk(res, 'Leave types found', leaveTypes);
    } catch (error) {
      logger.error(error);
      console.error(error);

      return responseInternalServerError(res, 'Failed to get leave types');
    }
  }

  return {
    allLeaveTypes
  }
}