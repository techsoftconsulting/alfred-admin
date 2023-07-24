import useService from '@shared/domain/hooks/use-service';
import UseQueryValue from '@shared/domain/models/use-query-value';
import QueryCreator from '@shared/domain/services/query-creator';
import useRepository from '@shared/domain/hooks/use-repository';
import QueryOptions from '@shared/domain/models/query-options';
import UserRoleRepository from '@modules/user/domain/repositories/user-role-repository';
import AdminRole from '@modules/user/domain/models/admin-role';

type ResponseQueryValue = Omit<UseQueryValue, 'data'> & {
    data?: AdminRole[];
};

export default function useFindUserRoles(options?: QueryOptions): ResponseQueryValue {
    const repo = useRepository<UserRoleRepository>(
        'UserRoleRepository'
    );
    const queryCreator = useService<QueryCreator>('QueryCreator');

    const queryState: ResponseQueryValue = queryCreator.execute(
        {
            id: 'user-roles',
            payload: {},
            type: 'listing'
        },
        () => repo.findAll(),
        {
            ...options ?? {}
        }
    );

    return queryState;
}
