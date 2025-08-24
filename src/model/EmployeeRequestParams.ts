export default interface EmployeeRequestParams {
    department?: string;
    salary_gte?: number;
    salary_lte?: number;
    birthDate_gte?: string;
    birthDate_lte?: string;
    order_by?: string;
}