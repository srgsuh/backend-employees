import {Request, Response} from "express";

export function defaultHandler(req: Request, res: Response) {
    res.status(404).json({error: `Path not found`});
}