type USER_ROLE = 'CUSTOMER' | 'RIDER' | 'VENDOR'

export interface AppUserProps {
    id: string;
    firstName: string;
    lastName: string;
    birthday?: Date;
    phone?: string;
    pictureUrls?: string[];
    email: string;
    roles: USER_ROLE[];
}

export interface AppUserPrimitiveProps extends Omit<AppUserProps, 'roles'> {
    roles: string[];
}

export default class AppUser {

    constructor(private props: AppUserProps) {

    }

    get id() {
        return this.props.id;
    }

    get firstName() {
        return this.props.firstName;
    }

    get lastName() {
        return this.props.lastName;
    }

    get phone() {
        return this.props.phone;
    }

    get birthday() {
        return this.props.birthday;
    }

    get email() {
        return this.props.email;
    }

    get fullName() {
        return `${this.props.firstName ?? ''} ${this.props.lastName ?? ''}`;
    }

    get pictureUrls() {
        return this.props.pictureUrls;
    }

    static fromPrimitives(props: AppUserPrimitiveProps) {
        return new AppUser({
            ...props,
            roles: props.roles as any
        });
    }

    toPrimitives(): AppUserPrimitiveProps {
        return {
            ...this.props
        };
    }
}
