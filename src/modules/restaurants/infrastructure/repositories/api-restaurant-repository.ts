import RestaurantRepository from '@modules/restaurants/domain/repositories/restaurant-repository';
import Restaurant from '@modules/restaurants/domain/models/restaurant';
import RestaurantMapper from '@modules/restaurants/infrastructure/mappers/restaurant-mapper';
import APIRepository from '@shared/infrastructure/api/api-repository';
import ApiRestaurantManagerRepository
    from '@modules/restaurants/infrastructure/repositories/api-restaurant-manager-repository';
import RestaurantManagerRepository from '@modules/restaurants/domain/repositories/restaurant-manager-repository';

const COLLECTION_NAME = 'stores';

export default class ApiRestaurantRepository extends APIRepository implements RestaurantRepository {

    private restaurantManageRepo: RestaurantManagerRepository;

    constructor(props) {
        super(props);

        this.restaurantManageRepo = new ApiRestaurantManagerRepository(props);
    }

    async findAll(filters?: any): Promise<Restaurant[]> {
        const defaultFilters = [
            {
                field: 'status',
                operator: '==',
                value: 'ACTIVE'
            }
        ];

        if (filters?.mallId) {
            defaultFilters.push({
                field: 'address',
                operator: '==',
                value: filters.mallId
            });
        }

        if (filters?.type) {
            defaultFilters.push({
                field: 'type',
                operator: '==',
                value: filters.type
            });
        }

        const docs: any = await this.findByCriteriaRequest(COLLECTION_NAME, defaultFilters, undefined, undefined, true);

        const restaurantManagers = await this.findByCriteriaRequest('restaurant-manager', [{
            field: 'status',
            operator: '==',
            value: 'ACTIVE'
        }], undefined, undefined, true);

        const vendorManagers = await this.findByCriteriaRequest('vendor-manager', [{
            field: 'status',
            operator: '==',
            value: 'ACTIVE'
        }], undefined, undefined, true);

        return RestaurantMapper.toDomainFromArray(docs.map((doc) => {
            const manager = (() => {
                if (doc.type === 'RESTAURANT') return restaurantManagers.find((m) => m.restaurantId === doc.id);

                return vendorManagers.find((m) => m.vendorId === doc.id);
            })();

            return {
                ...doc,
                manager: manager
            };
        }));
    }

    remove(id: string): Promise<void> {
        return this.deleteById(COLLECTION_NAME, id, true);
    }

    async save(restaurant: Restaurant): Promise<void> {
        const dto = RestaurantMapper.toPersistence(restaurant);

        return this.create(COLLECTION_NAME, dto, true);
    }

    async find(id: string): Promise<Restaurant | null> {

        const doc: any = await this.get(`${COLLECTION_NAME}/${id}`, true);

        if (!doc) return null;

        return RestaurantMapper.toDomain(doc);
    }

    async guardUniqueSlug(slug: string, id: string) {
        /* const exists = await this.find(id);

         const existingId = exists ? exists.id : undefined;

         const docs = await this.getDocs(COLLECTION_NAME, {
             filters: [
                 {
                     field: 'status',
                     operator: '==',
                     value: 'ACTIVE'
                 },
                 {
                     field: 'slug',
                     operator: '==',
                     value: slug
                 },
                 ...
                     (!!existingId ?
                         [{
                             field: 'id',
                             operator: '!=',
                             value: existingId
                         }] : [] as any)
             ]         });
 */

        const result = await this.create(`${COLLECTION_NAME}/guard-unique-slug`, {
            slug: slug,
            id: id
        }, true);

        if (!result) {
            throw new Error('SLUG_ALREADY_EXISTS');
        }
    }
}