import useService from '@shared/domain/hooks/use-service';
import UseQueryValue from '@shared/domain/models/use-query-value';
import QueryCreator from '@shared/domain/services/query-creator';
import useRepository from '@shared/domain/hooks/use-repository';
import QueryOptions from '@shared/domain/models/query-options';
import RestaurantManagerRepository from '@modules/restaurants/domain/repositories/restaurant-manager-repository';
import RestaurantManager from '@modules/restaurants/domain/models/restaurant-manager';

type ResponseQueryValue = Omit<UseQueryValue, 'data'> & {
    data?: RestaurantManager[];
};

export default function useFindRestaurantManagers(id: string, options?: QueryOptions): ResponseQueryValue {
    const repo = useRepository<RestaurantManagerRepository>(
        'RestaurantManagerRepository'
    );
    const queryCreator = useService<QueryCreator>('QueryCreator');

    const queryState: ResponseQueryValue = queryCreator.execute(
        {
            id: 'restaurant-managers',
            payload: {},
            type: ''
        },
        () => repo.findAll(id),
        {
            ...options ?? {}
        }
    );

    return queryState;
}
