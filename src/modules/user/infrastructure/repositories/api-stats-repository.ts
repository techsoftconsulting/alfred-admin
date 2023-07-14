import APIRepository from '@shared/infrastructure/api/api-repository';
import StatsRepository from '@modules/user/domain/repositories/stats-repository';

const COLLECTION_NAME = 'stats';
const stats = ['most-searched-malls', 'most-searched-restaurants', 'most-visited-malls', 'most-visited-restaurants', 'most-visited-promotions', 'most-reserved-restaurants'];

export default class ApiStatsRepository extends APIRepository implements StatsRepository {

    async find(): Promise<any> {

        const promises = stats.map((id) => {
            return this.get(`${COLLECTION_NAME}/${id}`, true);
        });

        const result = await Promise.all(promises);

        return stats.reduce((acc, key, idx) => {
            return {
                ...acc,
                [key]: result[idx]
            };
        }, {});

    }

}