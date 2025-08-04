import {Request, Response, NextFunction} from "express";

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
    const status = (error instanceof RangeError)? 404 : 400;
    const message = error.message;
    res.status(status).json({error: message});
}