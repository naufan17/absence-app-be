/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { leaveRequestRepository } from "../../repositories/leaveRequest.repository";
import { responseBadRequest, responseCreated, responseForbidden, responseInternalServerError, responseNotFound, responseOk } from "../../helpers/reponse.helper";
import logger from "../../config/logger";

export const leaveRequestUserController = () => {
  const createLeaveRequest = async (req: Request | any, res: Response) => {
    const { title, description, startDate, endDate, leaveTypeId } = req.body; 
    const { user }: { user: { sub: string, role: 'admin' | 'verifikator' | 'user' } } = req;

    if (startDate > new Date()) return responseBadRequest(res, 'Start date must be less than current date');
    if (startDate > endDate) return responseBadRequest(res, 'Start date must be less than end date');

    try {

      const leaveRequest = await leaveRequestRepository().create(user.sub, title, description, startDate, endDate, leaveTypeId);
      if (!leaveRequest) return responseInternalServerError(res, 'Failed to create leave request');
      
      return responseCreated(res, 'Leave request created successfully');
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to create leave request');
    }
  }

  const updateLeaveRequest = async (req: Request | any, res: Response) => {
    const { id } = req.params;
    const { title, description, startDate, endDate, leaveTypeId } = req.body; 
    const { user }: { user: { sub: string, role: 'admin' | 'verifikator' | 'user' } } = req;

    try {
      const leaveRequest = await leaveRequestRepository().update(id, user.sub, title, description, startDate, endDate, leaveTypeId);
      if (!leaveRequest) return responseInternalServerError(res, 'Failed to update leave request');
      
      return responseOk(res, 'Leave request updated successfully');
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to update leave request');
    }
  }

  const allLeaveRequests = async (req: Request | any, res: Response) => {
    const { user }: { user: { sub: string, role: 'admin' | 'verifikator' | 'user' } } = req;

    try {
      const leaveRequests = await leaveRequestRepository().findAllByUserId(user.sub);
      if (leaveRequests.length === 0) return responseNotFound(res, 'Leave requests not found');

      return responseOk(res, 'Leave requests found', leaveRequests);
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to get leave requests');
    }
  }

  const cancelLeaveRequest = async (req: Request | any, res: Response) => {
    const { id } = req.params;
    const { user }: { user: { sub: string, role: 'admin' | 'verifikator' | 'user' } } = req;

    try {
      const leaveRequest = await leaveRequestRepository().findById(id);
      if (!leaveRequest || leaveRequest.user_id !== user.sub) return responseNotFound(res, 'Leave request not found');
      if (['cancel', 'revoked', 'approved', 'rejected'].includes(leaveRequest.status)) return responseForbidden(res, 'Leave request status cannot be canceled');

      const leaveRequestCancel = await leaveRequestRepository().updateStatusCancel(id);
      if (!leaveRequestCancel) return responseInternalServerError(res, 'Failed to cancel leave request');
      
      return responseOk(res, 'Leave request canceled successfully');
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to cancel leave request');
    }
  }

  const deleteLeaveRequest = async (req: Request | any, res: Response) => {
    const { id } = req.params;
    const { user }: { user: { sub: string, role: 'admin' | 'verifikator' | 'user' } } = req;

    try {
      const leaveRequest = await leaveRequestRepository().findById(id);
      if (!leaveRequest) return responseNotFound(res, 'Leave request not found');
      if (leaveRequest.user_id !== user.sub) return responseNotFound(res, 'Leave request not found');

      const deleteLeaveRequest = await leaveRequestRepository().deleteById(id);
      if (!deleteLeaveRequest) return responseInternalServerError(res, 'Failed to delete leave request');
      
      return responseOk(res, 'Leave request deleted successfully');
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to delete leave request');
    }
  }

  return {
    createLeaveRequest,
    updateLeaveRequest,
    cancelLeaveRequest,
    allLeaveRequests,
    deleteLeaveRequest
  };
}