import _ from "lodash";

export default interface EmployeeRequestParams {
    department?: string;
    salary_gte?: number;
    salary_lte?: number;
    birthDate_gte?: string;
    birthDate_lte?: string;
    order_by?: string;
}

export type WhereOptions = Omit<EmployeeRequestParams, "order_by">;

export type OrderByOptions = Pick<EmployeeRequestParams, "order_by">;

export type SplitOptions = {whereOptions: WhereOptions, orderByOptions: OrderByOptions};