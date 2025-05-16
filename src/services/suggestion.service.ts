import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";
import { Suggestion } from "@prisma/client";

export class SuggestionService {

    static async getById(id: number) {
        const findSuggestion = await prisma.suggestion.findUnique({ where: { id } })
        if (!findSuggestion) throw new HttpException(404, 'Suggestion not found')
        return findSuggestion
    }

    // localhost:3000/api/Train/?title=dam
    static async getAll(title: string = '') {
        return await prisma.suggestion.findMany({
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

    static async create(userId: number, suggestion: Suggestion) {
        console.log('creando', userId)
        return await prisma.suggestion.create({
            data: {
                ...suggestion,
                idUserCreator: userId
            }
        })
    }

    static async update(id: number, suggestion: Suggestion) {
        const findsuggestion = await prisma.suggestion.findUnique({ where: { id } })
        if (!findsuggestion) throw new HttpException(404, 'Suggestion doesnt exists')
        return await prisma.suggestion.update({
            where: { id },
            data: {
                ...suggestion,
            }
        })
    }

    static async delete(id: number) {
        try {
            return await prisma.suggestion.delete({ where: { id } });
        } catch (error) {
            throw new HttpException(404, "suggestion not found");
        }
    }






}