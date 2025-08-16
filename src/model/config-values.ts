import {getEnvIntVariable, getEnvStrArray} from "../utils/env-utils.ts";
import {DEFAULT_EMPLOYEE_LIMITS} from "./default-values.ts";
import {DEFAULT_ADMIN_ROLES, DEFAULT_ROLES} from "./account-values.ts";

export const EmployeeLimits = {
    minSalary: getEnvIntVariable("MIN_SALARY", DEFAULT_EMPLOYEE_LIMITS.minSalary),
    maxSalary: getEnvIntVariable("MAX_SALARY", DEFAULT_EMPLOYEE_LIMITS.maxSalary),
    minAge: getEnvIntVariable("MIN_AGE", DEFAULT_EMPLOYEE_LIMITS.minAge),
    maxAge: getEnvIntVariable("MAX_AGE", DEFAULT_EMPLOYEE_LIMITS.maxAge),
    departments: getEnvStrArray("DEPARTMENTS", DEFAULT_EMPLOYEE_LIMITS.departments)
}

export const ROLES = getEnvStrArray("ROLES", DEFAULT_ROLES);
export const ADMIN_ROLES = getEnvStrArray("ADMIN_ROLES", DEFAULT_ADMIN_ROLES);