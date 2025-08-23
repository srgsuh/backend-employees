import LoginData from '../../model/LoginData.ts';
import LoginResponse from '../../model/LoginResponse.ts';
import type AccountingService from './AccountingService.ts';


export class AccountingServiceMock implements AccountingService {
    async addAccount(loginData: LoginData): Promise<void> {
        return;
    }
    async login(_: LoginData): Promise<LoginResponse> {
        return {} as LoginResponse;
    }
}