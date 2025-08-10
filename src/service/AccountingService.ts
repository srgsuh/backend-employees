import LoginData from "../model/LoginData.ts";

export interface AccountingService {
    login(loginData: LoginData): string;
}