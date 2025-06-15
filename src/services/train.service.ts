import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";
import { Train } from "@prisma/client";

export class TrainService {

  static async getById(id: number) {
    const findTrain = await prisma.train.findUnique({ where: { id } })
    if (!findTrain) throw new HttpException(404, 'Train not found')
    return findTrain
  }

  // localhost:3000/api/Train/?title=dam
  static async getAll(idUserCreator?: number, title: string = '') {
    return await prisma.train.findMany({
      where: {
        ...(idUserCreator && { idUserCreator }), // Solo filtra si se pasa el id
        ...(title && {
          title: {
            contains: title,
          }
        })
      },
      include: {
        userCreator: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });
  }

  static async comunidad(title: string = '') {
    return await prisma.train.findMany({
      where: {
        publico: true,
        ...(title && {
          title: {
            contains: title,
          }
        })
      },
      include: {
        userCreator: true, // <-- Esto incluye los datos del usuario creador
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });
  }

  static async create(userId: number, train: Train) {
    console.log('creando', userId)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })
    if (!user) throw new HttpException(404, 'User not found');
    if (user.role === 'user' || user.role === null){
      const trainsCount = await prisma.train.count({
        where: { idUserCreator: userId }
      })
      if (trainsCount >= 2) {
        throw new HttpException(403, 'You have reached the limit of trains');
      }
    }
    return await prisma.train.create({
      data: {
        ...train,
        idUserCreator: userId
      }
    })
  }

  static async update(id: number, train: Train, currentUser: { id: number, role: string }) {
    const findTrain = await prisma.train.findUnique({ where: { id } });

    if (!findTrain) throw new HttpException(404, 'Train does not exist');

    const isOwner = findTrain.idUserCreator === currentUser.id;
    const isAdmin = currentUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new HttpException(403, 'You are not allowed to update this train');
    }

    return await prisma.train.update({
      where: { id },
      data: {
        ...train,
      }
    });
  }


  static async delete(id: number, currentUser: { id: number, role: string }) {
    const findTrain = await prisma.train.findUnique({ where: { id } });

    if (!findTrain) throw new HttpException(404, 'Train does not exist');

    const isOwner = findTrain.idUserCreator === currentUser.id;
    const isAdmin = currentUser.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new HttpException(403, 'You are not allowed to delete this train');
    }

    try {
      // Borra primero los rates asociados
      await prisma.rate.deleteMany({ where: { idTrain: id } });

      // Ahora borra el train
      return await prisma.train.delete({ where: { id } });
    } catch (error) {
      console.error(error);
      throw new HttpException(500, 'Error deleting train');
    }
  }
  static async rate(
    idUser: number,
    idTrain: number,
    value: number
  ): Promise<void> {
    // Validar que el rating está dentro del rango permitido
    if (value < 0 || value > 5) {
      throw new Error("Rating must be between 0 and 5.");
    }

    // Verificar si la oferta existe
    const train = await prisma.train.findUnique({ where: { id: idTrain } });
    if (!train) {
      throw new Error("Train not found.");
    }
    await prisma.rate.upsert({
      where: { idUser_idTrain: { idUser, idTrain } },
      update: { value },
      create: { idUser, idTrain, value },
    });
  }

  static async getRate(idTrain: number) {
    const ratingStats = await prisma.rate.aggregate({
      where: { idTrain },
      _avg: { value: true }, // Calcular el promedio
      _count: { value: true }, // Contar el total de calificaciones
    });
    return {
      totalRatings: ratingStats._count.value || 0,
      averageRating: ratingStats._avg.value?.toFixed(2) || 0,
    };
  }

  static async getMyRate(idUser: number, idTrain: number) {
    return await prisma.rate.findUnique({
      where: { idUser_idTrain: { idUser, idTrain } },
    });
  }
}