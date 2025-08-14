import LoginData from "../model/LoginData.ts";
import LoginResponse from "../model/LoginResponse.js";

export default interface AccountingService {
    login(loginData: LoginData): LoginResponse;
}