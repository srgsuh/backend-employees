import { Request, Response } from "express";
import type AccountingService from "../service/Accounting/AccountingService.ts";


export class AuthController {
    constructor(private readonly accountingService: AccountingService) {}
    login = async (req: Request, res: Response): Promise<void> => {
        res.json(await this.accountingService.login(req.body));
    }
}