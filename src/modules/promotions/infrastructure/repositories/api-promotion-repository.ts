import PromotionRepository from '@modules/promotions/domain/repositories/promotion-repository';
import Promotion from '@modules/promotions/domain/models/promotion';
import PromotionMapper from '@modules/promotions/infrastructure/mappers/promotion-mapper';
import APIRepository from '@shared/infrastructure/api/api-repository';

const COLLECTION_NAME = 'restaurant-promotion';

export default class ApiPromotionRepository extends APIRepository implements PromotionRepository {

    async findAll(filters?: any): Promise<Promotion[]> {

        const defaultFilters = [
            {
                field: 'status',
                operator: '==',
                value: 'ACTIVE'
            }
        ];

        if (filters.type) {
            defaultFilters.push({
                field: 'type',
                operator: '==',
                value: filters.type
            });
        }

        if (filters?.mallId) {
            defaultFilters.push({
                field: 'mallsIds',
                operator: 'array-contains',
                value: filters.mallId
            });
        }

        if (filters?.availability) {
            if (filters.availability !== 'ALL') {
                defaultFilters.push({
                    field: 'available',
                    operator: '==',
                    value: filters.availability == 'AVAILABLE'
                });
            }
        }

        const docs: any = await this.findByCriteriaRequest(COLLECTION_NAME, defaultFilters, undefined, undefined, true);


        return PromotionMapper.toDomainFromArray(docs);
    }

    remove(id: string): Promise<void> {
        return this.deleteById(COLLECTION_NAME, id, true);
    }

    async save(item: Promotion): Promise<void> {
        const dto = PromotionMapper.toPersistence(item);

        return this.create(COLLECTION_NAME, dto, true);
    }

    async find(id: string): Promise<Promotion | null> {

        const doc: any = await this.get(`${COLLECTION_NAME}/${id}`, true);

        if (!doc) return null;

        return PromotionMapper.toDomain(doc);
    }


}