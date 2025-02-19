import { NextFunction, Request, Response } from "express"
import { TrainService } from "../services/train.service"
import { HttpException } from "../exceptions/httpException";


export class TrainController {
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid train ID");

            // pasar a entero
            const train = await TrainService.getById(id)
            res.status(200).json(train)
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            //localhost:3000/train?title=XXXXXX
            const { title } = req.query;
            const user = await TrainService.getAll(title as string)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const trainData = req.body
            const userId = req.user?.id
            if (!userId) throw new HttpException(400, "User creator ID is required");

            const newTrain = await TrainService.create(userId, trainData)
            res.status(200).json(newTrain)
        } catch (error) {
            next(error)
        }
    }
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const trainData = req.body
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid train ID");

            const updatedTrain = await TrainService.update(id, trainData)
            res.status(200).json(updatedTrain)
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid Train ID");

            const deletedTrain = await TrainService.delete(id)
            res.status(200).json(deletedTrain)
        } catch (error) {
            next(error)
        }
    }
}