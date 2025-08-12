import { Request, Response } from "express";
import type {AccountingService} from "../service/AccountingService.ts";
import {json} from "node:stream/consumers";

export class AuthController {
    constructor(private readonly accountingService: AccountingService) {}
    login = (req: Request, res: Response): void => {
        res.json(this.accountingService.login(req.body));
    }
}