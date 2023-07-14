import UserIdentity from '../models/user-identity';
import UserWithCredentials from '@modules/auth/domain/models/user-with-credentials';
import AuthCredentials from '@modules/auth/domain/models/auth-credentials';


export default interface AuthProvider {
    state: any;
    dispatch: any;

    login(params: AuthCredentials): Promise<string>;

    register(user: UserWithCredentials): Promise<any>;

    changeEmail(params: any): Promise<any>;

    logout(params: any): Promise<void | false | string>;

    checkAuth(params: any): Promise<void | string>;

    getIdentity?(): Promise<UserIdentity>;

    updateIdentity(params: any): Promise<void>;
    
    changePassword(params: any): Promise<any>;
}
