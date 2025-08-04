import EmployeesService from "../service/EmployeeService.ts";
import {NextFunction, Request, Response} from "express";

export class EmployeeController {
    constructor(private service: EmployeesService) {}

    getAll = (req: Request, res: Response, next: NextFunction) => {
        res.json(this.service.getAll());
    }

    get = (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        res.json(this.service.get(id));
    }

    add = (req: Request, res: Response, next: NextFunction) => {
        const employee = this.service.add(req.body);
        res.json(employee);
    }

    delete = (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        res.json(this.service.delete(id));
    }

    update = (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const fields = req.body;
        res.json(this.service.update({id, fields}));
    }
}