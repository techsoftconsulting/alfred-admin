import AuthCredentials from '@modules/auth/domain/models/auth-credentials';
import UserIdentity from '@modules/auth/domain/models/user-identity';
import UserWithCredentials from '@modules/auth/domain/models/user-with-credentials';
import AppIdentityService from '@modules/auth/infrastructure/providers/app-identity-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthProvider from '../../domain/services/auth-provider';
import {
    apiTokenName,
    userAppDataKeyName,
    userDataKeyName,
    userRoleKeyName
} from '@modules/auth/infrastructure/providers/auth-constants';
import { fetchJson } from '@shared/infrastructure/http/fetch';
import getApiUrl from '@shared/infrastructure/utils/get-api-url';
import jwt from 'jwt-decode';

class AppAuthProvider implements AuthProvider {
    public state: any;
    public dispatch: any;

    private identityService: AppIdentityService;

    constructor() {
        this.identityService = new AppIdentityService();
    }


    async login({
        email,
        password,
        isGuestUser
    }: AuthCredentials): Promise<string> {

        try {
            const res = await fetchJson(getApiUrl('login'), {
                method: 'POST', body: JSON.stringify({
                    email,
                    password
                })
            });

            const { token } = res.json;
            const data: any = jwt(token);

            await this.saveUserSession({
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                contactPhone: '',
                verifiedPhone: true,
                phoneVerificationSkipped: false,
                role: data.role
            }, token);

            return token;
        } catch (e) {
            console.log(e);
            throw new Error('USER_NOT_FOUND');
        }
    }

    async register(user: UserWithCredentials): Promise<any> {
        throw new Error('Not implemented');
    }

    async changeEmail({ email, password }): Promise<any> {
        throw new Error('Not implemented');
    }

    async checkAuth(params: any): Promise<void | string> {
        return new Promise(async (resolve, reject) => {
            const token = await AsyncStorage.getItem(apiTokenName);

            if (!!token) {
                resolve(token);
            } else {
                reject();
            }
        });
    }

    async getIdentity(): Promise<UserIdentity> {
        return this.identityService.getIdentity();
    }

    async updateIdentity(values: any): Promise<void> {
        await this.identityService.updateIdentity(values);
    }

    async changePassword({ email, oldPassword, password }): Promise<any> {
        const token = await this.checkAuth({});
        if (!token) throw new Error('unauthenticated');

        const res = await fetchJson(getApiUrl('change-password'), {
            method: 'POST', body: JSON.stringify({
                email,
                oldPassword,
                password
            }),
            token: token
        });
    }

    async logout(params: any): Promise<void | false | string> {
        await AsyncStorage.removeItem(apiTokenName);
        await AsyncStorage.removeItem(userRoleKeyName);
        await AsyncStorage.removeItem(userDataKeyName);
        await AsyncStorage.removeItem(userAppDataKeyName);

        const keys = await AsyncStorage.getAllKeys();

        await Promise.all(keys);
    }

    private async saveUserSession(dto: any, token: string) {
        const user = new UserIdentity({
            id: dto.id,
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
            contactPhone: dto.phone,
            identificationCardType: 'V',
            verifiedPhone: false,
            phoneVerificationSkipped: false,
            role: dto.role
        });

        await AsyncStorage.setItem(userRoleKeyName, 'USER');
        await AsyncStorage.setItem(
                userDataKeyName,
                JSON.stringify(user.toPrimitives())
        );

        await AsyncStorage.setItem(apiTokenName, token);
        return user;
    }


}

export async function getLoggedInUserSession() {
    const service = new AppIdentityService();
    return service.getIdentity ? service.getIdentity() : null;
}

export default AppAuthProvider;
