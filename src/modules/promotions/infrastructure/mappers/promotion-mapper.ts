import ObjectUtils from '@utils/misc/object-utils';
import Promotion from '@modules/promotions/domain/models/promotion';

export default class PromotionMapper {
    static toDomain(dto: any): Promotion {
        return Promotion.fromPrimitives({
            id: dto.id,
            imageUrl: dto.imageUrl,
            description: dto.description,
            available: dto.available,
            duration: {
                start: new Date(dto.duration.start),
                end: new Date(dto.duration.end)
            },
            mallsIds: dto.mallsIds ?? [],
            name: dto.name,
            createdAt: new Date(dto.createdAt),
            status: dto.status,
            restaurantId: dto.storeId,
            type: dto.type
        });
    }

    static toDomainFromArray(dtos: any[]): Promotion[] {
        return dtos.map(dto => PromotionMapper.toDomain(dto));
    }

    static toPersistence(restaurant: Promotion): any {
        const dto = restaurant.toPrimitives();

        return ObjectUtils.omitUnknown({
            id: dto.id,
            imageUrl: dto.imageUrl,
            available: dto.available,
            createdAt: dto.createdAt,
            mallsIds: dto.mallsIds,
            name: dto.name,
            status: dto.status,
            description: dto.description,
            duration: dto.duration,
            durationStart: dto.duration.start,
            durationEnd: dto.duration.end,
            storeId: dto.restaurantId,
            type: dto.type
        });
    }


}