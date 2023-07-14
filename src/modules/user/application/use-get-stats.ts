import useService from '@shared/domain/hooks/use-service';
import UseQueryValue from '@shared/domain/models/use-query-value';
import QueryCreator from '@shared/domain/services/query-creator';
import useRepository from '@shared/domain/hooks/use-repository';
import QueryOptions from '@shared/domain/models/query-options';
import StatsRepository from '@modules/user/domain/repositories/stats-repository';

type ResponseQueryValue = Omit<UseQueryValue, 'data'> & {
    data?: any;
};

export default function useGetStats(id: string, options?: QueryOptions): ResponseQueryValue {
    const repo = useRepository<StatsRepository>(
        'StatsRepository'
    );
    const queryCreator = useService<QueryCreator>('QueryCreator');

    const queryState: ResponseQueryValue = queryCreator.execute(
        {
            id: 'stats',
            payload: {
                id: id
            },
            type: 'get'
        },
        () => repo.find(),
        {
            ...options ?? {}
        }
    );

    return queryState;
}
