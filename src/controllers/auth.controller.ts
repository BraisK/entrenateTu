import { AuthService } from "../services/auth.service";
import e, { Response, Request, NextFunction } from 'express'
import jwt from "jsonwebtoken";

const TOKEN_PASSWORD = process.env.TOKEN_PASSWORD || 'pass'

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = req.body
            //TODO validar el body
            const newUser = await AuthService.register(userData)
            res.status(201).json({ message: 'User register successfully', newUser })
        } catch (error) {
            next(error)
        }

    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const userData = req.body //vienen por post en el cuerpo de la peticion
            console.log(userData)
            const token = await AuthService.login(userData.email, userData.password)
            //TODO devolver una cookie
            res.cookie('token', token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true, // no accesible por js
                secure: false, //solo se activa si usas hhtps
                sameSite: 'strict' //solo valido si = sitio (= dominio back+front)(seguro csrf)
            })
            res.status(201).json({ message: 'Login successfully:', token })

        } catch (error) {
            next(error)
            console.log('Noooo')
            console.log(error)
        }
    }
    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            res.clearCookie('token')
            res.status(204).json({ message: 'Logout successfully' })
        } catch (error) {
            next(error)
        }

    }
    static async getAuthenticatedUser (req: Request, res: Response, next: NextFunction){
        try {
            const token = req.cookies.token;
            if (!token)  res.status(401).json({ message: "No autenticado" });
            const decoded = jwt.verify(token, TOKEN_PASSWORD);
            res.status(200).json(decoded)
        } catch (error) {
            next(error)
        }
    };

}