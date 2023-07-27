interface RestaurantManagerCredentials {
    email: string;
    password?: string;
}

interface RestaurantManagerProps {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    restaurantId: string;
    storeType: string;
    credentials?: RestaurantManagerCredentials;
    status: string;
    principal?: boolean;
}

export interface RestaurantManagerPrimitiveProps extends RestaurantManagerProps {

}

export default class RestaurantManager {
    constructor(protected props: RestaurantManagerProps) {
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

    get email() {
        return this.props.email;
    }

    get credentials() {
        return this.props.credentials;
    }

    get restaurantId() {
        return this.props.restaurantId;
    }

    get isVendorManager() {
        return this.props.storeType == 'VENDOR';
    }

    static fromPrimitives(props: RestaurantManagerPrimitiveProps) {
        return new RestaurantManager({
            ...props,
            email: props.email?.toLowerCase(),
            credentials: props.credentials ? {
                ...props.credentials,
                email: props.credentials.email?.toLowerCase()
            } : undefined
        });
    }

    toPrimitives(): RestaurantManagerPrimitiveProps {
        return {
            ...this.props
        };
    }
}