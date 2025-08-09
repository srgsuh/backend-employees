export interface EmployeeLimits {
    maxSalary: number;
    minSalary: number;
    minAge: number;
    maxAge: number;
    departments: string[];
}

export const BASE_LIMITS: EmployeeLimits = {
    minSalary: 10_000,
    maxSalary: 100_000,
    minAge: 18,
    maxAge: 81,
    departments: ["IT", "QA", "Sales", "HR", "Finance"]
};