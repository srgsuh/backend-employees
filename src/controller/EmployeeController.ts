import EmployeesService from "../service/EmployeeService.ts";
import {NextFunction, Request, Response} from "express";

export class EmployeeController {
    constructor(private service: EmployeesService) {}

    getAll = (req: Request, res: Response, next: NextFunction) => {
        res.json(this.service.getAll());
    }

    getEmployee = (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        res.json(this.service.getEmployee(id));
    }

    addEmployee = (req: Request, res: Response, next: NextFunction) => {
        const employee = this.service.addEmployee(req.body);
        res.json(employee);
    }

    deleteEmployee = (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        res.json(this.service.deleteEmployee(id));
    }

    updateEmployee = (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const fields = req.body;
        res.json(this.service.updateEmployee({id, fields}));
    }
}