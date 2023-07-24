import MutationCreator from '@shared/domain/services/mutation-creator';
import useService from '@shared/domain/hooks/use-service';
import useRepository from '@shared/domain/hooks/use-repository';
import Mutation from '@shared/domain/models/mutation';
import UserRepository from '@modules/user/domain/repositories/user-repository';
import AdminUser from '@modules/user/domain/models/admin-user';

export default function useSaveUser() {

    const repo = useRepository<UserRepository>('UserRepository');
    const mutationCreator = useService<MutationCreator>('MutationCreator');

    const mutation: Mutation = {
        id: 'users',
        payload: {},
        type: 'save'
    };

    const [mutate, state] = mutationCreator.execute(
        mutation,
        async ({ entity }: { entity: AdminUser }) => {
            await repo.save(entity);
        },
        {
            onFailure: () => {

            },
            onSuccess: async (response, queryClient) => {
                await queryClient.invalidateQueries({
                    predicate: (query) => {
                        const queryKey: any = query.queryKey[0];
                        return [mutation.id]
                        .map((i) => i)
                        .includes(queryKey.id);
                    }
                });
            }
        }
    );

    return {
        execute: async (entity: AdminUser) => {
            return mutate({
                ...mutation,
                payload: {
                    entity: entity
                }
            });
        },
        loading: state.loading,
        loaded: state.loaded,
        data: null
    };

}
