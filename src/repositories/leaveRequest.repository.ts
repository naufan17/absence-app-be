import prisma from "../config/prisma";


export const leaveRequestRepository = () => {
  const create = async (
    user_id: string, 
    title: string, 
    description: string,
    start_date: Date,
    end_date: Date,
    leave_type_id: string,
  ) => {
    return await prisma.leaveRequest.create({ 
      data: { 
        user_id, 
        title, 
        description,
        start_date,
        end_date,
        leave_type_id,
        status: 'pending',
      } 
    });
  }

  const update = async (id: string, user_id: string, title: string, description: string, start_date: Date, end_date: Date, leave_type_id: string) => {
    return await prisma.leaveRequest.update({ 
      where: { 
        id 
      }, 
      data: { 
        user_id, 
        title, 
        description,
        start_date,
        end_date,
        leave_type_id,
      } 
    });
  }

  const findAll = async () => {
    return await prisma.leaveRequest.findMany({
      orderBy: {
        created_at: 'desc'
      },
      select: {
        id: true,
        user_id: true,
        title: true,
        description: true,
        start_date: true,
        end_date: true,
        leave_type: {
          select: {
            name: true
          }
        },
        status: true
      }
    });
  }

  const findAllByStatus = async (status: 'pending' | 'cancel' | 'revoked' | 'approved' | 'rejected') => {
    return await prisma.leaveRequest.findMany({
      where: {
        status
      },
      orderBy: {
        created_at: 'desc'
      },
      select: {
        id: true,
        user_id: true,
        title: true,
        description: true,
        start_date: true,
        end_date: true,
        leave_type: {
          select: {
            name: true
          }
        },
        status: true
      }
    });
  }

  const findAllByUserId = async (user_id: string) => {
    return await prisma.leaveRequest.findMany({
      where: {
        user_id
      },
      orderBy: {
        created_at: 'desc'
      },
      select: {
        id: true,
        user_id: true,
        title: true,
        description: true,
        start_date: true,
        end_date: true,
        leave_type: {
          select: {
            name: true
          }
        },
        status: true
      }
    });
  }

  const findById = async (id: string) => {
    return await prisma.leaveRequest.findUnique({ 
      where: { 
        id 
      },
      select: {
        id: true,
        user_id: true,
        title: true,
        description: true,
        start_date: true,
        end_date: true,
        leave_type: {
          select: {
            name: true
          }
        },
        status: true
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
    update,
    findAll,
    findAllByStatus,
    findAllByUserId,
    findById,
    updateStatus,
    updateStatusCancel,
    deleteById
  }
}