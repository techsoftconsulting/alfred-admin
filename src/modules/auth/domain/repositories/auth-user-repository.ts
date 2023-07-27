export default interface AuthUserRepository {
    
    forgotPassword(userEmail: string): Promise<void>;

    verifyResetPasswordCode(params: { email: string; code: string }): Promise<void>;

    resetPassword(params: { email: string; code: string, password: string }): Promise<void>;

}
