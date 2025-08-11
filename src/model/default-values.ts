const DEFAULT_EMPLOYEE_LIMITS = {
    minSalary: 10_000,
    maxSalary: 100_000,
    minAge: 18,
    maxAge: 81,
    departments: ["IT", "QA", "Sales", "HR", "Finance"]
};

const EmployeeLimits = {
    minSalary: +(process.env.MIN_SALARY ?? DEFAULT_EMPLOYEE_LIMITS.minSalary),
    maxSalary: +(process.env.MAX_SALARY ?? DEFAULT_EMPLOYEE_LIMITS.maxSalary),
    minAge: +(process.env.MIN_AGE ?? DEFAULT_EMPLOYEE_LIMITS.minAge),
    maxAge: +(process.env.MAX_AGE ?? DEFAULT_EMPLOYEE_LIMITS.maxAge),
    departments: process.env.DEPARTMENTS?.split(",") ?? DEFAULT_EMPLOYEE_LIMITS.departments,
}
export default EmployeeLimits;