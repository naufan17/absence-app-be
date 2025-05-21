import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { leaveRequestRepository } from "../../repositories/leaveRequest.repository";
import { responseBadRequest, responseForbidden, responseInternalServerError, responseNotFound, responseOk } from "../../helpers/reponse.helper";
import logger from "../../config/logger";

export const leaveRequestVerifikatorController = () => {
  const allLeaveRequests = async (req: Request, res: Response): Promise<void> => {
    const { status, page, limit }: { status?: 'pending' | 'canceled' | 'revoked' | 'approved' | 'rejected', page?: number, limit?: number } = req.query;

    try {
      const leaveRequests = await leaveRequestRepository().findAll(Number(page) || 1, Number(limit) || 20, status);
      if (leaveRequests.length === 0) return responseNotFound(res, 'Leave requests not found');

      const totalCount = await leaveRequestRepository().totalCount(status);
      if (totalCount === 0) return responseNotFound(res, 'Leave requests not found');

      return responseOk(res, 'Leave requests found', {
        leaveRequests,
        meta: {
          page: Number(page) || 1,
          limit: Number(limit) || 20,
          total: leaveRequests.length,
          totalData: totalCount,
          totalPage: Math.ceil(totalCount / (Number(limit) || 20))
        }
      });
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to get leave requests');
    }
  }

  const updateStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status, comment } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) return responseBadRequest(res, errors.array()[0].msg);

    try {
      const leaveRequest = await leaveRequestRepository().findById(id);
      if (!leaveRequest) return responseNotFound(res, 'Leave request not found');
      if (['canceled', 'approved', 'revoked', 'rejected'].includes(leaveRequest.status)) return responseForbidden(res, 'Leave request status cannot be replayed');
      
      const leaveRequestStatus = await leaveRequestRepository().updateStatus(id, status, comment);
      if (!leaveRequestStatus) return responseInternalServerError(res, 'Failed to update leave request status');
      
      return responseOk(res, 'Leave request status updated successfully');
    } catch (error) {
      logger.error(error);
      console.error(error);
      
      return responseInternalServerError(res, 'Failed to update leave request status');
    }
  }

  const getStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const totalCount = await leaveRequestRepository().totalCount();
      const statusCounts = await leaveRequestRepository().statusCounts();
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
    allLeaveRequests,
    updateStatus,
    getStatistics
  };
}