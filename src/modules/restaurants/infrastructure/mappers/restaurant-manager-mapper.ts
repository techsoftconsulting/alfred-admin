import ObjectUtils from '@utils/misc/object-utils';
import RestaurantManager from '@modules/restaurants/domain/models/restaurant-manager';

export default class RestaurantManagerMapper {

    static toDomain(dto: any): RestaurantManager {
        return RestaurantManager.fromPrimitives({
            id: dto.id,
            email: dto.email,
            firstName: dto.firstName,
            restaurantId: dto.restaurantId ?? dto.vendorId,
            status: dto.status,
            lastName: dto.lastName,
            role: dto.role,
            storeType: dto.storeType
        });
    }

    static toDomainFromArray(dtos: any[]): RestaurantManager[] {
        return dtos.map(dto => RestaurantManagerMapper.toDomain(dto));
    }

    static toPersistenceFromArray(managers: RestaurantManager[]): RestaurantManager[] {
        return managers.map(m => RestaurantManagerMapper.toPersistence(m));
    }

    static toPersistence(manager: RestaurantManager): any {
        const dto = manager.toPrimitives();

        const prop = manager.isVendorManager ? 'vendorId' : 'restaurantId';

        return {
            ...ObjectUtils.omitUnknown({
                id: dto.id,
                email: dto.email.toLowerCase(),
                firstName: dto.firstName,
                lastName: dto.lastName,
                roles: ['USER'],
                status: dto.status,
                type: dto.role
            }),
            [prop]: dto.restaurantId
        };
    }

}