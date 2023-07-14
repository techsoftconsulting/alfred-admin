import useService from '@shared/domain/hooks/use-service';
import MutationCreator from '@shared/domain/services/mutation-creator';
import Mutation from '@shared/domain/models/mutation';
import useAuthProvider from '@modules/auth/application/use-auth-provider';
import AdminUser from '@modules/user/domain/models/admin-user';

export default function useUpdatePassword() {
    const mutationCreator = useService<MutationCreator>('MutationCreator');

    const mutation: Mutation = {
        id: 'user-profile',
        payload: {},
        type: 'delete'
    };
    const authProvider = useAuthProvider();

    const [mutate, state] = mutationCreator.execute(
        mutation,
        async ({
            user,
            email,
            oldPassword,
            password
        }: { user: AdminUser, email: string, oldPassword: string, password: string }) => {
            try {
                await authProvider
                .changePassword({
                    email: email,
                    oldPassword: oldPassword,
                    password: password
                });

            } catch (e) {
                throw new Error(e.message);
            }
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
        execute: async (user: AdminUser, email: string, oldPassword: string, password: string) => {
            return mutate({
                ...mutation,
                payload: {
                    user: user,
                    email: email,
                    oldPassword: oldPassword,
                    password: password
                }
            });
        },
        loading: state.loading,
        loaded: state.loaded,
        data: null
    };
}
