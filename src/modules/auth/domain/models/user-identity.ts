import { AdminRolePrimitiveProps } from '@modules/user/domain/models/admin-role';

export interface UserIdentityProps {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    contactPhone: string;
    verifiedPhone?: boolean;
    phoneVerificationSkipped: boolean;
    identificationCardType: string;
    role: AdminRolePrimitiveProps;
}

export interface UserIdentityPrimitiveProps {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    contactPhone: string;
    verifiedPhone?: boolean;
    phoneVerificationSkipped: boolean;
    identificationCardType: string;
    role: AdminRolePrimitiveProps;
}

export default class UserIdentity {
    constructor(private props: UserIdentityProps) {
    }

    get isGuest() {
        return this.props.id === 'GUEST_USER';
    }

    get id() {
        return this.props.id;
    }

    get firstName() {
        return this.props.firstName;
    }

    get roleId() {
        return this.props.role?.id;
    }

    get isSuperAdmin() {
        return this.props.role?.id === 'SUPER_ADMIN';
    }

    get hasAValidPhone() {
        return this.props.verifiedPhone;
    }

    get lastName() {
        return this.props.lastName;
    }

    get email() {
        return this.props.email;
    }

    static fromPrimitives(props: UserIdentityPrimitiveProps) {
        return new UserIdentity({
            ...props
        });
    }

    toPrimitives(): UserIdentityPrimitiveProps {
        return {
            ...this.props
        };
    }
}
