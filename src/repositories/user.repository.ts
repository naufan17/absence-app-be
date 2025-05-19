import prisma from "../config/prisma"


export const userRepository = () => {
  const create = async (name: string, email: string, password: string) => {
    return await prisma.user.create({ 
      data: { 
        name, 
        email, 
        password 
      } 
    });
  }

  const findByEmail = async (email: string) => {
    return await prisma.user.findFirst({ 
      where: { 
        email 
      },
      select: {
        id: true,
        password: true,
        role: true,
        is_verified: true
      } 
    });
  }

  const findById = async (id: string) => {
    return await prisma.user.findFirst({ 
      where: { 
        id 
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_verified: true
      } 
    });
  }

  const findAllWithRole = async () => {
    return await prisma.user.findMany({
      where: {
        role: { 
          in: ['user', 'verifikator'] 
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_verified: true
      }
    });
  }

  const findAllWithVerified = async () => {
    return await prisma.user.findMany({
      where: {
        role: { 
          in: ['user'] 
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        is_verified: true
      }
    });
  }

  const updateVerified = async (id: string) => {
    return await prisma.user.update({
      where: {
        id
      },
      data: {
        is_verified: true
      }
    });
  }

  const updateRole = async (id: string, role: 'user' | 'verifikator') => {
    return await prisma.user.update({
      where: {
        id
      },
      data: {
        role
      }
    });
  }

  const updatePassword = async (id: string, password: string) => {
    return await prisma.user.update({
      where: {
        id
      },
      data: {
        password
      }
    });
  }

  return {
    create,
    findByEmail,
    findById,
    findAllWithRole,
    findAllWithVerified,
    updateVerified,
    updateRole,
    updatePassword
  }
}