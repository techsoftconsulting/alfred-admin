export default interface AuthCredentials {
    email: string;
    phone?: string;
    password: string;
    cpassword?: string;
    isGuestUser?: boolean;
}
