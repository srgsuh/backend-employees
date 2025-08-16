import LoginData from "../model/LoginData.ts";
import LoginResponse from "../model/LoginResponse.ts";

export default interface AccountingService {
    login(loginData: LoginData): LoginResponse;
}