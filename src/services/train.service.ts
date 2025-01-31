import {   PrismaClient, Train,  } from "@prisma/client";
import { HttpException } from "../exceptions/httpException"
import bcrypt, { compare } from "bcrypt"
import jwt from "jsonwebtoken"

// Alta cohexion y bajo acoplamiento

// Usar un patron singleton

const prisma = new PrismaClient()
const TOKEN_PASSWORD = process.env.TOKEN_PASSWORD || 'pass'

export class TrainService {
    static async getById(id: number) {
        const findTrain = await prisma.train.findUnique({ where: { id } })
        if (!findTrain) throw new HttpException(404, 'User not found')
        return findTrain
    }

    static async getAll() {
        const trains = await prisma.train.findMany()
        return trains
    }
    static async save(train: Train) {
        return await prisma.train.create({
            data: {
                ...train
            }
        })
    }
    static async delete(id: number) {
        return await prisma.train.delete( {
            where: {id}
        }
        )
    }
    static async update(id:number, change:Train ) {
        return await prisma.train.update( {
            where:{id},
            data:change
        }
        )
    }
}