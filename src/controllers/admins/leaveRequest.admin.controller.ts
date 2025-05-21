import { Request, Response } from "express";
import { leaveRequestRepository } from "../../repositories/leaveRequest.repository";
import { responseInternalServerError, responseNotFound, responseOk } from "../../helpers/reponse.helper";
import logger from "../../config/logger";

export const leaveRequestAdminController = () => {
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
    getStatistics
  };
}