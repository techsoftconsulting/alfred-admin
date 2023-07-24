export default interface AuthUserRepository {

    resetPassword(userEmail: string): Promise<void>;

}
