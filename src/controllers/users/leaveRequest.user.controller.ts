/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { leaveRequestRepository } from "../../repositories/leaveRequest.repository";
import { responseBadRequest, responseCreated, responseForbidden, responseInternalServerError, responseNotFound, responseOk } from "../../helpers/reponse.helper";
import logger from "../../config/logger";

export const leaveRequestUserController = () => {
  const createLeaveRequest = async (req: Request | any, res: Response): Promise<void> => {
    const { title, description, startDate, endDate, leaveTypeId } = req.body; 
    const { user }: { user: { sub: string, role: 'admin' | 'verifikator' | 'user' } } = req;

    const errors = validationResult(req);
    if (!errors.isEmpty()) return responseBadRequest(res, errors.array()[0].msg);

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

  const updateLeaveRequest = async (req: Request | any, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, description, startDate, endDate, leaveTypeId } = req.body; 
    const { user }: { user: { sub: string, role: 'admin' | 'verifikator' | 'user' } } = req;

    const errors = validationResult(req);
    if (!errors.isEmpty()) return responseBadRequest(res, errors.array()[0].msg);

    try {
      const leaveRequest = await leaveRequestRepository().findById(id);
      if (!leaveRequest || leaveRequest.user_id !== user.sub) return responseNotFound(res, 'Leave request not found');
      if (['canceled', 'approved', 'rejected'].includes(leaveRequest.status)) return responseForbidden(res, 'Leave request status cannot be canceled');

      const leaveRequestupdate = await leaveRequestRepository().update(id, user.sub, title, description, startDate, endDate, leaveTypeId);
      if (!leaveRequestupdate) return responseInternalServerError(res, 'Failed to update leave request');
      
      return responseOk(res, 'Leave request updated successfully');
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to update leave request');
    }
  }

  const allLeaveRequests = async (req: Request | any, res: Response): Promise<void> => {
    const { user, page, limit }: { user: { sub: string, role: 'admin' | 'verifikator' | 'user' }, page?: number, limit?: number } = req;

    try {
      const leaveRequests = await leaveRequestRepository().findAllByUserId(Number(page) || 1, Number(limit) || 20, user.sub);
      if (leaveRequests.length === 0) return responseNotFound(res, 'Leave requests not found');
      
      const leaveRequestCount = await leaveRequestRepository().totalCountByUserId(user.sub);
      if (leaveRequestCount === 0) return responseNotFound(res, 'Leave requests not found');

      return responseOk(res, 'Leave requests found', {
        leaveRequests,
        meta: {
          page: Number(page) || 1,
          limit: Number(limit) || 20,
          total: leaveRequests.length,
          totalData: leaveRequestCount,
          totalPage: Math.ceil(leaveRequestCount / (Number(limit) || 20))
        }
      });
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to get leave requests');
    }
  }

  const cancelLeaveRequest = async (req: Request | any, res: Response): Promise<void> => {
    const { id } = req.params;
    const { user }: { user: { sub: string, role: 'admin' | 'verifikator' | 'user' } } = req;

    try {
      const leaveRequest = await leaveRequestRepository().findById(id);
      if (!leaveRequest || leaveRequest.user_id !== user.sub) return responseNotFound(res, 'Leave request not found');
      if (['canceled', 'revoked', 'approved', 'rejected'].includes(leaveRequest.status)) return responseForbidden(res, 'Leave request status cannot be canceled');

      const leaveRequestCancel = await leaveRequestRepository().updateStatusCancel(id);
      if (!leaveRequestCancel) return responseInternalServerError(res, 'Failed to cancel leave request');
      
      return responseOk(res, 'Leave request canceled successfully');
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to cancel leave request');
    }
  }

  const deleteLeaveRequest = async (req: Request | any, res: Response): Promise<void> => {
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

    const getStatistics = async (req: Request | any, res: Response): Promise<void> => {
    const { user }: { user: { sub: string, role: 'admin' | 'verifikator' | 'user' } } = req;

    try {
      const totalCount = await leaveRequestRepository().totalCountByUserId(user.sub);
      const statusCounts = await leaveRequestRepository().statusCountsByUserId(user.sub);
      type Status = 'pending' | 'revoked' | 'approved' | 'rejected' | 'canceled';
      const countsByStatus: Record<Status, number> = {
        pending: 0,
        revoked: 0,
        approved: 0,
        rejected: 0,
        canceled: 0
      };

      statusCounts.forEach(item => {
        countsByStatus[item.status as keyof typeof countsByStatus] = item._count.status;
      });

      return responseOk(res, 'Statistics found', { total: totalCount, ...countsByStatus });
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to get statistics');
    }
  }

  return {
    createLeaveRequest,
    updateLeaveRequest,
    cancelLeaveRequest,
    allLeaveRequests,
    deleteLeaveRequest,
    getStatistics
  };
}