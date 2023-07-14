import ObjectUtils from '@utils/misc/object-utils';

interface PromotionProps {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    available: boolean;
    duration: {
        start: Date;
        end: Date
    };
    mallsIds: string[];
    status: string;
    createdAt: Date;
    restaurantId: string;
    type: string;
}

interface PromotionPrimitiveProps extends PromotionProps {

}

export default class Promotion {

    constructor(protected props: PromotionProps) {
    }

    get id() {
        return this.props.id;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get type() {
        return this.props.type;
    }

    get typeName() {
        if (this.props.type == 'RESTAURANT') return 'Restaurante';
        return 'Tienda departamental';
    }

    get imageUrl() {
        return this.props.imageUrl;
    }

    get restaurantId() {
        return this.props.restaurantId;
    }

    get isActive() {
        return this.props.available;
    }

    get name() {
        return this.props.name;
    }

    get mallsIds() {
        return this.props.mallsIds;
    }

    static fromPrimitives(props: PromotionPrimitiveProps) {
        return new Promotion({
            ...props
        });
    }

    updateInfo(info: Omit<Partial<PromotionProps>, 'id' | 'imageUrl' | 'createdAt'>) {
        this.props = ObjectUtils.merge(this.props, info);
        this.props.mallsIds = info.mallsIds ?? this.props.mallsIds ?? [];
    }

    updateImageUrl(imageUrl: string) {
        this.props.imageUrl = imageUrl;
    }

    toPrimitives(): PromotionPrimitiveProps {
        return {
            ...this.props
        };
    }
}