import EmployeesService from "../service/EmployeeService.ts";
import {Request, Response} from "express";

export class EmployeeController {
    constructor(private service: EmployeesService) {}

    getAll = (req: Request, res: Response) => {
        res.json(this.service.getAll(req.searchObject));
    }

    getEmployee = (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(this.service.getEmployee(id));
    }

    addEmployee = (req: Request, res: Response) => {
        const employee = this.service.addEmployee(req.body);
        res.json(employee);
    }

    deleteEmployee = (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(this.service.deleteEmployee(id));
    }

    updateEmployee = (req: Request, res: Response) => {
        const id = req.params.id;
        const fields = req.body;
        res.json(this.service.updateEmployee({...fields, id}));
    }
}