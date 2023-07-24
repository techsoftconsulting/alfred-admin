import MutationCreator from '@shared/domain/services/mutation-creator';
import useService from '@shared/domain/hooks/use-service';
import useRepository from '@shared/domain/hooks/use-repository';
import Mutation from '@shared/domain/models/mutation';
import RestaurantManagerRepository from '@modules/restaurants/domain/repositories/restaurant-manager-repository';
import RestaurantManager from '@modules/restaurants/domain/models/restaurant-manager';

export default function useSaveRestaurantManager() {

    const repo = useRepository<RestaurantManagerRepository>('RestaurantManagerRepository');
    const mutationCreator = useService<MutationCreator>('MutationCreator');

    const mutation: Mutation = {
        id: 'restaurant-managers',
        payload: {},
        type: 'save'
    };

    const [mutate, state] = mutationCreator.execute(
        mutation,
        async ({ entity }: { entity: RestaurantManager }) => {
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
        execute: async (entity: RestaurantManager) => {
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
