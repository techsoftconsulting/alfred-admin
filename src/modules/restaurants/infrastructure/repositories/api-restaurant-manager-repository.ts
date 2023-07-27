import RestaurantManagerRepository from '@modules/restaurants/domain/repositories/restaurant-manager-repository';
import RestaurantManager from '@modules/restaurants/domain/models/restaurant-manager';
import RestaurantManagerMapper from '@modules/restaurants/infrastructure/mappers/restaurant-manager-mapper';
import APIRepository from '@shared/infrastructure/api/api-repository';

const COLLECTION_NAME = 'restaurant-manager';

export default class ApiRestaurantManagerRepository extends APIRepository implements RestaurantManagerRepository {

    async findAll(restaurantId: string, filters: any): Promise<RestaurantManager[]> {

        const defaultFilters = [
            {
                field: 'status',
                operator: '==',
                value: 'ACTIVE'
            },
            {
                field: 'roles',
                operator: 'array-contains',
                value: 'USER'
            },
            {
                field: 'restaurantId',
                operator: '==',
                value: restaurantId
            }
        ];

        if (filters.principal !== undefined) {
            defaultFilters.push({
                field: 'principal',
                operator: '==',
                value: Boolean(filters.principal)
            });
        }
        const docs: any = await this.findByCriteriaRequest(COLLECTION_NAME, defaultFilters, undefined, undefined, true);

        return RestaurantManagerMapper.toDomainFromArray(docs);
    }

    remove(id: string): Promise<void> {
        return this.deleteById(COLLECTION_NAME, id, true);
    }

    async save(manager: RestaurantManager): Promise<void> {
        const dto = RestaurantManagerMapper.toPersistence(manager);
        const collection = manager.isVendorManager ? 'vendor-manager' : 'restaurant-manager';

        const foundUser = await this.findByEmail(manager.email, manager.isVendorManager ? 'VENDOR' : 'RESTAURANT');

        if (!foundUser) {
            if (!manager.credentials) return;
            return this.create(collection, { ...dto, credentials: manager.credentials }, true);
        }

        if (foundUser.id !== manager.id) {
            throw new Error('USER_ALREADY_EXISTS');
        }

        return this.create(collection, dto, true);
    }


    async find(id: string): Promise<RestaurantManager | null> {
        const doc: any = await this.get(`${COLLECTION_NAME}/${id}`, true);

        if (!doc) return null;

        return RestaurantManagerMapper.toDomain(doc);
    }

    async findByEmail(email: string, type: string): Promise<RestaurantManager | null> {

        const filters = [
            {
                field: 'status',
                operator: '==',
                value: 'ACTIVE'
            },
            {
                field: 'roles',
                operator: 'array-contains',
                value: 'USER'
            },
            {
                field: 'email',
                operator: '==',
                value: email
            }
        ];

        if (type == 'VENDOR') {
            const vendorManagerDocs: any = await this.findByCriteriaRequest('vendor-manager', filters, undefined, undefined, true);
            if (vendorManagerDocs.length == 0) return null;
            const item = vendorManagerDocs?.[0];
            return RestaurantManagerMapper.toDomain(item);
        }

        const restaurantManagerDocs: any = await this.findByCriteriaRequest(COLLECTION_NAME, filters, undefined, undefined, true);

        if (restaurantManagerDocs.length == 0) return null;

        const item = restaurantManagerDocs?.[0];

        return RestaurantManagerMapper.toDomain(item);
    }
}