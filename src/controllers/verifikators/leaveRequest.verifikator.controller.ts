import { Request, Response } from "express";
import { leaveRequestRepository } from "../../repositories/leaveRequest.repository";
import { responseInternalServerError, responseNotFound, responseOk } from "../../helpers/reponse.helper";
import logger from "../../config/logger";

export const leaveRequestVerifikatorController = () => {
  const allLeaveRequests = async (req: Request, res: Response) => {
    try {
      const leaveRequests = await leaveRequestRepository().findAll();
      if (leaveRequests.length === 0) return responseNotFound(res, 'Leave requests not found');

      return responseOk(res, 'Leave requests found', leaveRequests);
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to get leave requests');
    }
  }

  return {
    allLeaveRequests
  };
}