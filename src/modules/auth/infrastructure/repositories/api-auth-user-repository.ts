import AuthUserRepository from '@modules/auth/domain/repositories/auth-user-repository';

export default class ApiAuthUserRepository implements AuthUserRepository {

    async resetPassword(userEmail: string): Promise<void> {
        // await sendPasswordResetEmail(this.firebaseAuth, userEmail);
    }
}
