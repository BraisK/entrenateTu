import { HttpException } from "../exceptions/httpException";
import { UserService } from "../services/user.service";
import { Response, Request, NextFunction } from 'express'


export class UserController {
    static async profile(req: Request, res: Response, next: NextFunction) {
        try {
            const email = req.user?.email
            if (!email) throw new HttpException(404, 'Email not found')
            const user = await UserService.getByEmail(email)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            //localhost:3000/train?title=XXXXXX
            const { email } = req.query;
            const user = await UserService.getAll(email as string)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }
    static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) throw new HttpException(401, 'No autorizado');
            const { name, surname, accepNotifications } = req.body;
            const updatedUser = await UserService.updateProfile(Number(userId), { name, surname, accepNotifications });
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }
}

/* function login(){

}

function register(){

} */