import LoginData from "../model/LoginData.ts";
import LoginResponse from "../model/LoginResponse.js";

export interface AccountingService {
    login(loginData: LoginData): LoginResponse;
}