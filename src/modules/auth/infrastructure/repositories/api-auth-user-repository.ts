import AuthUserRepository from '@modules/auth/domain/repositories/auth-user-repository';
import APIRepository from '@shared/infrastructure/api/api-repository';

const COLLECTION_NAME = 'forgot-password';

export default class ApiAuthUserRepository extends APIRepository implements AuthUserRepository {

    async verifyResetPasswordCode(params: { email: string; code: string }): Promise<void> {
        await this.post(`${COLLECTION_NAME}/verify-reset-password-code`, params);
    }

    async forgotPassword(userEmail: string): Promise<void> {
        await this.post(`${COLLECTION_NAME}/request-change-password`, {
            email: userEmail
        });
    }

    async resetPassword(params: { email: string; code: string, password: string }): Promise<void> {
        await this.post(`${COLLECTION_NAME}/change-password`, params);
    }
}
