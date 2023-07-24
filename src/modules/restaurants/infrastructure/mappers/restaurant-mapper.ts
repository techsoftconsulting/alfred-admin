import Restaurant from '@modules/restaurants/domain/models/restaurant';
import ObjectUtils from '@utils/misc/object-utils';
import RestaurantManagerMapper from '@modules/restaurants/infrastructure/mappers/restaurant-manager-mapper';

export default class RestaurantMapper {
    static toDomain(dto: any): Restaurant {
        return Restaurant.fromPrimitives({
            id: dto.id,
            logoUrl: dto.logoUrl,
            coverImageUrl: dto.coverImageUrl,
            description: dto.description,
            schedule: dto.schedule ? (Object.keys(dto.schedule).reduce((acc, id) => {
                const el = dto.schedule[id];
                return {
                    ...acc,
                    [id]: {
                        ...el,
                        startHour: el?.startHour ? new Date(el.startHour) : undefined,
                        endHour: el?.endHour ? new Date(el.endHour) : undefined
                    }
                };
            }, {})) : undefined,
            contactPhone: dto.contactPhone,
            recommended: dto.recommended ?? false,
            categoriesIds: dto.categoriesIds,
            name: dto.name,
            createdAt: new Date(dto.createdAt),
            slug: dto.slug,
            address: dto.address,
            status: dto.status,
            available: dto.available,
            type: dto.type,
            manager: dto.manager ? RestaurantManagerMapper.toDomain(dto.manager).toPrimitives() : undefined
        });
    }

    static toDomainFromArray(dtos: any[]): Restaurant[] {
        return dtos.map(dto => RestaurantMapper.toDomain(dto));
    }

    static toPersistence(restaurant: Restaurant): any {
        const dto = restaurant.toPrimitives();

        return ObjectUtils.omitUnknown({
            id: dto.id,
            logoUrl: dto.logoUrl,
            createdAt: dto.createdAt,
            coverImageUrl: dto.coverImageUrl,
            contactPhone: dto.contactPhone,
            categoriesIds: dto.categoriesIds,
            address: dto.address,
            name: dto.name,
            slug: dto.slug,
            recommended: dto.recommended,
            status: dto.status,
            description: dto.description,
            schedule: ObjectUtils.omitUnknown(Object.keys(dto.schedule).reduce((acc, id) => {
                return {
                    ...acc,
                    [id]: ObjectUtils.omitUnknown(dto.schedule[id])
                };
            }, {})),
            available: dto.available,
            type: dto.type
        });
    }


}