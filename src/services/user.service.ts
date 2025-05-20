import { prisma } from "../database/database";
import { HttpException } from "../exceptions/httpException";

export class UserService {
    static async getByEmail(email: string) {
        const findUser = await prisma.user.findUnique(
            { where: { email }, omit: { password: true } }
        )
        if (!findUser) throw new HttpException(404, 'User not found')
        return findUser
    }

    static async getById(id: number) {
        const findUser = await prisma.user.findUnique({ where: { id } })
        if (!findUser) throw new HttpException(404, 'User not found')
        return findUser
    }
    static async getAll(email: string = '') {
        return await prisma.user.findMany({
            where: {
                ...(email && {
                    email: {
                        contains: email,
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
}