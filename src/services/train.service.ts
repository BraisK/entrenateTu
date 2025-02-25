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
            return await prisma.train.delete({ where: { id } });
        } catch (error) {
            throw new HttpException(404, "Train not found");
        }
    }






}