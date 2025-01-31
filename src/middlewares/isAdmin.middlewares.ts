import { Response, Request, NextFunction } from 'express'
import jwt from "jsonwebtoken"

const TOKEN_PASSWORD = process.env.TOKEN_PASSWORD || 'pass'
// TODO quita el any
export const isAdmin = (req: Request, res: Response, next: NextFunction): any => {

    const { role } = req.body.user
    try {
        if (role === 'admin') {
            next()
        } else {
            res.status(401).json({ error: 'Access denied, no Admin' })
        }
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' })
    }
}