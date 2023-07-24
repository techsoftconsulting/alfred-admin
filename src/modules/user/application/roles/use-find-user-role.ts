import useService from '@shared/domain/hooks/use-service';
import UseQueryValue from '@shared/domain/models/use-query-value';
import QueryCreator from '@shared/domain/services/query-creator';
import useRepository from '@shared/domain/hooks/use-repository';
import QueryOptions from '@shared/domain/models/query-options';
import AdminRole from '@modules/user/domain/models/admin-role';
import UserRoleRepository from '@modules/user/domain/repositories/user-role-repository';

type ResponseQueryValue = Omit<UseQueryValue, 'data'> & {
    data?: AdminRole;
};

export default function useFindUserRole(id: string, options?: QueryOptions): ResponseQueryValue {
    const repo = useRepository<UserRoleRepository>(
        'UserRoleRepository'
    );
    const queryCreator = useService<QueryCreator>('QueryCreator');

    const queryState: ResponseQueryValue = queryCreator.execute(
        {
            id: 'user-roles',
            payload: {},
            type: 'get'
        },
        () => repo.find(id),
        {
            ...options ?? {}
        }
    );

    return queryState;
}
