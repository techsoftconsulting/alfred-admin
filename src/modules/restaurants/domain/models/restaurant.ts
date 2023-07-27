import { ENV } from '@shared/infrastructure/utils/get-envs';
import RestaurantManager, { RestaurantManagerPrimitiveProps } from '@modules/restaurants/domain/models/restaurant-manager';

interface RestaurantProps {
    id: string;
    name: string;
    slug: string;
    type: string;
    status: string;
    createdAt: Date;
    available: boolean;
    categoriesIds?: string[];
    description?: string;
    logoUrl?: string;
    coverImageUrl?: string;
    schedule?: any;
    address?: string;
    contactPhone?: string;
    manager?: RestaurantManager;
    recommended?: boolean;
}

interface RestaurantPrimitiveProps extends Omit<RestaurantProps, 'manager'> {
    manager?: RestaurantManagerPrimitiveProps;
}

export default class Restaurant {

    constructor(protected props: RestaurantProps) {
    }

    get id() {
        return this.props.id;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get logoUrl() {
        return this.props.logoUrl;
    }

    get coverImageUrl() {
        return this.props.coverImageUrl;
    }

    get manager() {
        return this.props.manager;
    }

    get contactPhone() {
        return this.props.contactPhone;
    }

    get slug() {
        return this.props.slug;
    }

    get categoriesIds() {
        return this.props.categoriesIds;
    }

    get mallId() {
        return this.props.address;
    }

    get available() {
        return this.props.available;
    }

    get accessUrl() {
        if (this.props.type == 'VENDOR') {
            return `${ENV.VENDOR_URL}/login?id=${this.slug}`;
        }
        return `${ENV.RESTAURANT_URL}/login?id=${this.slug}`;
    }

    get managerEmail() {
        return this.props.manager?.email;
    }

    get managerId() {
        return this.props.manager?.id;
    }

    get name() {
        return this.props.name;
    }

    get type() {
        return this.props.type;
    }

    get typeName() {
        if (this.props.type == 'RESTAURANT') return 'Restaurante';
        if (this.props.type == 'VENDOR') return 'Tienda departamental';
        return 'Restaurante';
    }

    static fromPrimitives(props: RestaurantPrimitiveProps) {
        return new Restaurant({
            ...props,
            manager: props.manager ? RestaurantManager.fromPrimitives(props.manager) : undefined
        });
    }

    updateLogoUrl(logoUrl: string) {
        this.props.logoUrl = logoUrl;
    }

    updateCoverImageUrl(url: string) {
        this.props.coverImageUrl = url;
    }

    toPrimitives(): RestaurantPrimitiveProps {
        return {
            ...this.props,
            manager: this.props.manager?.toPrimitives()
        };
    }
}