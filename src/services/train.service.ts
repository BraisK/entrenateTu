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
  static async getAll(title: string = '') {
    return await prisma.train.findMany({
      where: {
        ...(title && {
          title: {
            contains: title,
            //mode: "insensitive" // Búsqueda sin distinción entre mayúsculas y minúsculas
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
    return await prisma.train.create({
      data: {
        ...train,
        idUserCreator: userId
      }
    })
  }

  static async update(id: number, train: Train) {
    const findtrain = await prisma.train.findUnique({ where: { id } })
    if (!findtrain) throw new HttpException(404, 'Train doesnt exists')
    return await prisma.train.update({
      where: { id },
      data: {
        ...train,
      }
    })
  }

static async delete(id: number) {
  try {
    // Borra primero los rates asociados
    await prisma.rate.deleteMany({ where: { idTrain: id } });
    // Ahora borra el train
    return await prisma.train.delete({ where: { id } });
  } catch (error) {
    console.error(error);
    throw new HttpException(404, "Train not found");
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

    // Actualizar o crear la calificación

    /*
        SELECT  AVG(value) AS averageValue, COUNT(value) AS totalCount
    FROM Rating
    WHERE offerId = <offerId>;
        */
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