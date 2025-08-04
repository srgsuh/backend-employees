import {Request, Response, NextFunction} from "express";

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    const status = 400;
    const message = error.message;
    res.status(status).json({error: message});
}