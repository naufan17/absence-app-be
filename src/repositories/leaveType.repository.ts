import prisma from "../config/prisma"


export const leaveTypeRepository = () => {
  const create = async (name: string) => {
    return await prisma.leaveType.create({ 
      data: { 
        name 
      } 
    });
  }

  const findAll = async () => {
    return await prisma.leaveType.findMany();
  }

  return {
    create,
    findAll
  }
}