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

    const createWithRole = async (name: string, email: string, password: string, role: 'user' | 'verifikator') => {
    return await prisma.user.create({ 
      data: { 
        name, 
        email, 
        password,
        role
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

  const findAllWithRole = async (page: number, limit: number, role?: 'user' | 'verifikator') => {
    return await prisma.user.findMany({
      where: {
        ...(role ? { 
          role 
        } : { 
          role: { 
            in: ['user', 'verifikator'] 
          } 
        }),
      },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit,
      orderBy: [
        { role: 'asc' },
        { updated_at: 'desc' }
      ],
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });
  }

  const findAllWithVerified = async (page: number, limit: number, is_verified?: boolean) => {
    return await prisma.user.findMany({
      where: {
        role: { 
          in: ['user', 'verifikator'] 
        },
        ...(typeof is_verified === 'boolean' ? { 
          is_verified 
        } : {}),
      },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit,
      orderBy: [
        { is_verified: 'asc' },
        { updated_at: 'desc' }
      ],
      select: {
        id: true,
        name: true,
        email: true,
        is_verified: true,
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

  const updateProfile = async (id: string, name: string, email: string) => {
    return await prisma.user.update({
      where: {
        id
      },
      data: {
        name,
        email
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

  const totalCount = async (role?: 'user' | 'verifikator', is_verified?: boolean) => {
    return await prisma.user.count({
      where: {
        ...(role ? { 
          role 
        } : { 
          role: { 
            in: ['user', 'verifikator'] 
          } 
        }),
        ...(typeof is_verified === 'boolean' ? { 
          is_verified 
        } : {}),
      }
    });
  }

  const totalCountByUserId = async (id: string) => {
    return await prisma.user.count({
      where: {
        id
      }
    });
  }

  const roleCounts = async () => {
    return await prisma.user.groupBy({
      where: {
        role: { 
          in: ['user', 'verifikator'] 
        },
      },
      by: ['role'],
      _count: {
        role: true
      }
    });
  }

  const verifiedCounts = async () => {
    return await prisma.user.groupBy({
      where: {
        role: { 
          in: ['user', 'verifikator'] 
        },
      },
      by: ['is_verified'],
      _count: {
        is_verified: true
      }
    });
  }

  return {
    create,
    createWithRole,
    findByEmail,
    findById,
    findAllWithRole,
    findAllWithVerified,
    updateVerified,
    updateRole,
    updateProfile,
    updatePassword,
    totalCount,
    totalCountByUserId,
    roleCounts,
    verifiedCounts
  }
}