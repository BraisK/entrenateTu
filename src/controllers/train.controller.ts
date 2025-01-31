import { NextFunction, Request, Response } from "express"
import { TrainService } from "../services/train.service"

export class TrainController {
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id)
            const train = await TrainService.getById(id)
            res.status(200).json(train)
        } catch (error) {
            next(error)
        }
    }
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const train = await TrainService.getAll()
            res.status(200).json(train)
        } catch (error) {
            next(error)
        }
    }
    static async save(req: Request, res: Response, next: NextFunction) {
        try {
            const train = req.body
            await TrainService.save(train)
            res.status(200).json(train)
        } catch (error) {
            next(error)
        }
    }
    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const idTrain = Number(req.params.id)
            await TrainService.delete(idTrain)
            res.status(200).json(idTrain)
        } catch (error) {
            next(error)
        }
    }
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const train = Number(req.params.id)
            const change = req.body
            await TrainService.update(train, change)
            res.status(200).json(train)
        } catch (error) {
            next(error)
        }
    }

}