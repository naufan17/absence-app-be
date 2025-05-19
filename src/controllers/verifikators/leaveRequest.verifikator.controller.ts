import { Request, Response } from "express";
import { leaveRequestRepository } from "../../repositories/leaveRequest.repository";
import { responseInternalServerError, responseNotFound, responseOk } from "../../helpers/reponse.helper";
import logger from "../../config/logger";

export const leaveRequestVerifikatorController = () => {
  const allLeaveRequests = async (req: Request, res: Response) => {
    const { status }: { status?: 'pending' | 'cancel' | 'revoked' | 'approved' | 'rejected' } = req.query;

    try {
      const leaveRequests = await leaveRequestRepository().findAll(status);
      if (leaveRequests.length === 0) return responseNotFound(res, 'Leave requests not found');

      return responseOk(res, 'Leave requests found', leaveRequests);
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to get leave requests');
    }
  }

  const updateStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, comment } = req.body;

    try {
      const leaveRequest = await leaveRequestRepository().updateStatus(id, status, comment);
      if (!leaveRequest) return responseInternalServerError(res, 'Failed to update leave request status');
      
      return responseOk(res, 'Leave request status updated successfully');
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to update leave request status');
    }
  }

  return {
    allLeaveRequests,
    updateStatus
  };
}