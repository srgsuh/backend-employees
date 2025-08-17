import LoginData from '../model/LoginData.ts';
import LoginResponse from '../model/LoginResponse.ts';
import type AccountingService from './AccountingService.ts';
import {accountingServiceRegistry} from "./registry.ts";
import {AccountingServiceMap} from "./AccountingServiceMap.js";

export class AccountingServiceMock implements AccountingService {
    login(_: LoginData): LoginResponse {
        return {} as LoginResponse;
    }
}

accountingServiceRegistry.registerService(
    AccountingServiceMock.name,
    async () => new AccountingServiceMock()
);