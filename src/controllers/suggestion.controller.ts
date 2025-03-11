import { NextFunction, Request, Response } from "express"
import { SuggestionService } from "../services/suggestion.service"
import { HttpException } from "../exceptions/httpException";


export class SuggestionController {
    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid suggestion ID");

            // pasar a entero
            const suggestion = await SuggestionService.getById(id)
            res.status(200).json(suggestion)
        } catch (error) {
            next(error)
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            //localhost:3000/train?title=XXXXXX
            const { title } = req.query;
            const user = await SuggestionService.getAll(title as string)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const suggestionData = req.body
            const userId = req.user?.id
            if (!userId) throw new HttpException(400, "User creator ID is required");

            const newSuggestion = await SuggestionService.create(userId, suggestionData)
            res.status(200).json(newSuggestion)
        } catch (error) {
            next(error)
        }
    }
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const suggestionData = req.body
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid suggestion ID");

            const updatedSuggestion = await SuggestionService.update(id, suggestionData)
            res.status(200).json(updatedSuggestion)
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number.parseInt(req.params.id)
            if (isNaN(id)) throw new HttpException(400, "Invalid suggestion ID");

            const deletedSuggestion = await SuggestionService.delete(id)
            res.status(200).json(deletedSuggestion)
        } catch (error) {
            next(error)
        }
    }
}