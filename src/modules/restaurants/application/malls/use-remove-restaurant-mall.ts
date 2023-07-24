import MutationCreator from '@shared/domain/services/mutation-creator';
import useService from '@shared/domain/hooks/use-service';
import useRepository from '@shared/domain/hooks/use-repository';
import Mutation from '@shared/domain/models/mutation';
import RestaurantMallRepository from '@modules/restaurants/domain/repositories/restaurant-mall-repository';

export default function useRemoveRestaurantMall() {

    const repo = useRepository<RestaurantMallRepository>('RestaurantMallRepository');
    const mutationCreator = useService<MutationCreator>('MutationCreator');

    const mutation: Mutation = {
        id: 'restaurant-malls',
        payload: {},
        type: 'delete'
    };

    const [mutate, state] = mutationCreator.execute(
        mutation,
        async ({ id }: { id: string }) => {
            await repo.remove(id);
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
        execute: async (id: string) => {
            return mutate({
                ...mutation,
                payload: {
                    id: id
                }
            });
        },
        loading: state.loading,
        loaded: state.loaded,
        data: null
    };

}
