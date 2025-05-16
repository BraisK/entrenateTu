import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/httpException';

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    try {
        if (res.headersSent) {
            return next(error); 
        }
        const status = error.status || 500;
        const message = error.message || 'Something went wrong';

        res.status(status).json({ message });
    } catch (err) {
        next(err); 
    }
};
