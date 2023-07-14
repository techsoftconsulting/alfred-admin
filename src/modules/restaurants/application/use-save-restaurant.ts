import MutationCreator from '@shared/domain/services/mutation-creator';
import useService from '@shared/domain/hooks/use-service';
import useRepository from '@shared/domain/hooks/use-repository';
import Mutation from '@shared/domain/models/mutation';
import RestaurantRepository from '@modules/restaurants/domain/repositories/restaurant-repository';
import Restaurant from '@modules/restaurants/domain/models/restaurant';
import FileUploader from '@shared/domain/services/file-uploader';
import RestaurantManagerRepository from '@modules/restaurants/domain/repositories/restaurant-manager-repository';
import useNotify from '@shared/domain/hooks/use-notify';

export default function useSaveRestaurant() {

    const repo = useRepository<RestaurantRepository>('RestaurantRepository');
    const managerRepo = useRepository<RestaurantManagerRepository>('RestaurantManagerRepository');
    const mutationCreator = useService<MutationCreator>('MutationCreator');
    const fileUploader = useService<FileUploader>('FileUploader');
    const notify = useNotify();
    const mutation: Mutation = {
        id: 'restaurants',
        payload: {},
        type: 'save'
    };

    const [mutate, state] = mutationCreator.execute(
        mutation,
        async ({ entity, images }: { entity: Restaurant, images: any }) => {

            const foundRestaurant = await repo.find(entity.id);

            if (!foundRestaurant) {
                if (entity.managerEmail) {
                    const manager = await managerRepo.findByEmail(entity.managerEmail, entity.type);
                    if (manager && manager.id !== entity.managerId) throw new Error('MANAGER_ALREADY_EXISTS');
                }
            }

            const logoUrl = images.logoUrl?.blob ? await fileUploader.uploadFile(
                images.logoUrl.blob,
                `stores/${entity.id}/logo`,
                images.logoUrl?.fileName
            ) : entity.logoUrl;

            entity.updateLogoUrl(logoUrl as string);

            const coverImageUrl = images.coverImageUrl?.blob ? await fileUploader.uploadFile(
                images.coverImageUrl.blob,
                `stores/${entity.id}/coverImage`,
                images.coverImageUrl?.fileName
            ) : entity.coverImageUrl;

            entity.updateCoverImageUrl(coverImageUrl as string);

            await repo.save(entity);
        },
        {
            onFailure: (e) => {

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
        execute: async (entity: Restaurant, images: any) => {
            try {
                return mutate({
                    ...mutation,
                    payload: {
                        entity: entity,
                        images: images
                    }
                });
            } catch (e) {
                throw new Error(e.message);
            }
        },
        loading: state.loading,
        loaded: state.loaded,
        data: null
    };

}
