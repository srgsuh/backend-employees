import EmployeeService from "../service/EmployeeService.ts";
import {Request, Response} from "express";

export class EmployeeController {
    constructor(private service: EmployeeService) {}

    getAll = async (req: Request, res: Response) => {
        res.json(await this.service.getAll(req.searchObject));
    }

    getEmployee =  async(req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await this.service.getEmployee(id));
    }

    addEmployee = async (req: Request, res: Response) => {
        const employee = await this.service.addEmployee(req.body);
        res.json(employee);
    }

    deleteEmployee = async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await this.service.deleteEmployee(id));
    }

    updateEmployee = async (req: Request, res: Response) => {
        const id = req.params.id;
        const fields = req.body;
        res.json(await this.service.updateEmployee(id, fields));
    }
}