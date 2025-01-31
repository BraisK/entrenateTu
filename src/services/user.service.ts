import { Prisma, PrismaClient, User } from "@prisma/client";
import {HttpException} from "../exceptions/httpException"
import bcrypt, { compare } from "bcrypt"
import jwt from "jsonwebtoken"

// Alta cohexion y bajo acoplamiento

// Usar un patron singleton

const prisma = new PrismaClient()
const TOKEN_PASSWORD = process.env.TOKEN_PASSWORD || 'pass'

export class UserService {    
    static async getUserByEmail(email:string){
        const findUser = await prisma.user.findUnique(
            { where: {email}, omit: {password:true}} 
        )
        if(!findUser) throw new HttpException(404, 'User not found')
        return findUser
    }

    static async getUserById(id:number){
        const findUser = await prisma.user.findUnique({ where: {id}})
        if(!findUser) throw new HttpException(404, 'User not found')
        return findUser
    }

    static async getAll(){
        const users = await prisma.user.findMany({
            omit:{password:true}
        })
        return users
    }
}