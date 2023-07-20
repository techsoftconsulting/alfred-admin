import RestaurantCategoryRepository from '@modules/restaurants/domain/repositories/restaurant-category-repository';
import RestaurantCategory from '@modules/restaurants/domain/models/restaurant-category';
import ObjectUtils from '@utils/misc/object-utils';
import APIRepository from '@shared/infrastructure/api/api-repository';

const COLLECTION_NAME = 'categories';

export default class ApiRestaurantCategoryRepository extends APIRepository implements RestaurantCategoryRepository {

    async findAll(filters?: any): Promise<RestaurantCategory[]> {

        const defaultFilters = [
            {
                field: 'status',
                operator: '==',
                value: 'ACTIVE'
            }
        ];

        if (filters?.type) {
            defaultFilters.push({
                field: 'type',
                operator: '==',
                value: filters.type
            });
        }

        const docs: any = await this.findByCriteriaRequest(COLLECTION_NAME, defaultFilters, undefined, undefined, true);

        return docs.map(doc => {
            return {
                slug: doc.slug,
                id: doc.id,
                name: doc.name,
                type: doc.type,
                status: doc.status
            };
        });
    }

    remove(id: string): Promise<void> {
        return this.deleteById(COLLECTION_NAME, id, true);
    }

    save(category: RestaurantCategory): Promise<void> {
        return this.create(COLLECTION_NAME, ObjectUtils.omitUnknown({
            ...category
        }), true);
    }

    async find(id: string): Promise<RestaurantCategory | null> {
        const doc: any = await this.get(`${COLLECTION_NAME}/${id}`, true);

        if (!doc) return null;

        return {
            slug: doc.slug,
            id: doc.id,
            name: doc.name,
            status: doc.status,
            type: doc.type
        };
    }

}