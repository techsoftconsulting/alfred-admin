import MutationCreator from '@shared/domain/services/mutation-creator';
import useService from '@shared/domain/hooks/use-service';
import useRepository from '@shared/domain/hooks/use-repository';
import Mutation from '@shared/domain/models/mutation';
import RestaurantMallRepository from '@modules/restaurants/domain/repositories/restaurant-mall-repository';
import RestaurantMall from '@modules/restaurants/domain/models/restaurant-mall';
import FileUploader from '@shared/domain/services/file-uploader';

export default function useSaveRestaurantMall() {

    const repo = useRepository<RestaurantMallRepository>('RestaurantMallRepository');
    const mutationCreator = useService<MutationCreator>('MutationCreator');
    const fileUploader = useService<FileUploader>('FileUploader');

    const mutation: Mutation = {
        id: 'restaurant-malls',
        payload: {},
        type: 'save'
    };

    const [mutate, state] = mutationCreator.execute(
        mutation,
        async ({ entity, images }: { entity: RestaurantMall, images: any }) => {
            const logoUrl = images.logoUrl?.blob ? await fileUploader.uploadFile(
                images.logoUrl.blob,
                `malls/${entity.id}/logo`,
                images.logoUrl?.fileName
            ) : images.logoUrl;

            await repo.save({ ...entity, logoUrl: logoUrl });
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
        execute: async (entity: RestaurantMall, images: any) => {
            return mutate({
                ...mutation,
                payload: {
                    entity: entity,
                    images: images
                }
            });
        },
        loading: state.loading,
        loaded: state.loaded,
        data: null
    };

}
