import MutationCreator from '@shared/domain/services/mutation-creator';
import useService from '@shared/domain/hooks/use-service';
import useRepository from '@shared/domain/hooks/use-repository';
import Mutation from '@shared/domain/models/mutation';
import RestaurantManagerRepository from '@modules/restaurants/domain/repositories/restaurant-manager-repository';
import RestaurantManager from '@modules/restaurants/domain/models/restaurant-manager';
import RestaurantRepository from '@modules/restaurants/domain/repositories/restaurant-repository';

export default function useSaveRestaurantManager() {

    const repo = useRepository<RestaurantManagerRepository>('RestaurantManagerRepository');
    const restRepo = useRepository<RestaurantRepository>('RestaurantRepository');
    const mutationCreator = useService<MutationCreator>('MutationCreator');

    const mutation: Mutation = {
        id: 'restaurant-managers',
        payload: {},
        type: 'save'
    };

    const [mutate, state] = mutationCreator.execute(
        mutation,
        async ({ entity }: { entity: RestaurantManager }) => {
            const restaurant = await restRepo.find(entity.restaurantId);
            if (!restaurant) throw new Error('RESTAURANT_NOT_FOUND');

            const found = await repo.findByEmail(entity.email, restaurant.type);

            if (!!found) throw new Error('MANAGER_ALREADY_EXISTS');

            await repo.save(entity);
        },
        {
            onFailure: () => {

            },
            onSuccess: async (response, queryClient) => {
                await queryClient.invalidateQueries({
                    predicate: (query) => {
                        const queryKey: any = query.queryKey[0];
                        return [mutation.id, 'restaurants']
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
