export interface Employee {
    id?: string;
    fullName: string;
    avatar: string;
    department: string;
    birthDate: string;
    salary: number;
}

export interface Updater {
    id: string;
    fields: Partial<Employee>;
}