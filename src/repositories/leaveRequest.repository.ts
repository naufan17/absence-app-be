import prisma from "../config/prisma";


export const leaveRequestRepository = () => {
  const create = async (
    user_id: string, 
    title: string, 
    description: string,
    start_date: Date,
    end_date: Date,
    leave_type_id: string,
    status: 'pending',
  ) => {
    return await prisma.leaveRequest.create({ 
      data: { 
        user_id, 
        title, 
        description,
        start_date,
        end_date,
        leave_type_id,
        status
      } 
    });
  }

  const findAll = async () => {
    return await prisma.leaveRequest.findMany();
  }

  const findAllByStatus = async (status: 'pending' | 'cancel' | 'revoked' | 'approved' | 'rejected') => {
    return await prisma.leaveRequest.findMany({
      where: {
        status
      }
    });
  }

  const findById = async (id: string) => {
    return await prisma.leaveRequest.findUnique({ 
      where: { 
        id 
      } 
    });
  }

  const updateStatus = async (id: string, status: 'pending' | 'cancel' | 'revoked' | 'approved' | 'rejected', comment: string) => {
    return await prisma.leaveRequest.update({ 
      where: { 
        id 
      }, 
      data: { 
        status,
        comment
      } 
    });
  }

  const updateStatusCancel = async (id: string) => {
    return await prisma.leaveRequest.update({ 
      where: { 
        id 
      }, 
      data: { 
        status: 'cancel',
      } 
    });
  }

  const deleteById = async (id: string) => {
    return await prisma.leaveRequest.delete({ 
      where: { 
        id 
      } 
    });
  }

  return {
    create,
    findAll,
    findAllByStatus,
    findById,
    updateStatus,
    updateStatusCancel,
    deleteById
  }
}