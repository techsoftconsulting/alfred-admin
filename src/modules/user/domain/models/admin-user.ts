interface AdminUserCredentials {
    email: string;
    password: string;
}

interface AdminUserProps {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    credentials?: AdminUserCredentials;
    role: string;
}

interface AdminUserPrimitiveProps extends AdminUserProps {

}

export default class AdminUser {
    constructor(private props: AdminUserProps) {

    }

    get fullName() {
        return `${this.props.firstName} ${this.props.lastName}`;
    }

    get id() {
        return this.props.id;
    }

    get roleId() {
        return this.props.role;
    }

    get email() {
        return this.props.email;
    }

    static fromPrimitives(props: AdminUserPrimitiveProps) {
        return new AdminUser({
            ...props,
            email: props.email.toLowerCase(),
            credentials: props.credentials ? {
                ...props.credentials,
                email: props.credentials.email?.toLowerCase()
            } : undefined

        });
    }

    toPrimitives(): AdminUserPrimitiveProps {
        return {
            ...this.props
        };
    }

}