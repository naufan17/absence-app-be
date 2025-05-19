import prisma from "../config/prisma"


export const leaveTypeRepository = () => {
  const findAll = async () => {
    return await prisma.leaveType.findMany({
      select: {
        id: true,
        name: true
      }
    });
  }

  return {
    findAll
  }
}