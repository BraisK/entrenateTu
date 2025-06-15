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
    static async updateProfile(
        userId: number,
        data: { name?: string; surname?: string; accepNotifications?: boolean }
    ) {
        // Solo permite editar si el usuario existe
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new HttpException(404, 'User not found');

        // Actualiza name, surname y accepNotifications si vienen en data
        return await prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.surname && { surname: data.surname }),
                ...(typeof data.accepNotifications === "boolean" && { accepNotifications: data.accepNotifications }),
            },
            select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                role: true,
                accepNotifications: true,
            }
        });
    }
}