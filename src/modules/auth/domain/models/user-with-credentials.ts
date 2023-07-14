import AuthCredentials from '@modules/auth/domain/models/auth-credentials';
import GeoPoint from '@shared/domain/models/geo-point';


export default interface UserWithCredentials extends User {
    credentials: AuthCredentials;
    signUpLocation?: GeoPoint;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
    verifiedPhone?: boolean;
    phoneVerificationSkipped: boolean;
    phone: string;
    email: string;
    signedUpAt?: Date;
    birthday?: Date;
    referralCode?: string;
    referrerCode?: string;
}