import useNotify from '@shared/domain/hooks/use-notify';
import { useCallback, useState } from 'react';
import useAuthProvider from './use-auth-provider';
import useAuthDispatch from '@modules/auth/ui/hooks/use-auth-dispatch';
import useNavigation from '@shared/domain/hooks/navigation/use-navigation';

type Login = {
    loading: boolean;
    login: (params: any, isGuestUser?: boolean) => Promise<any>;
};

export default function useLoginWithEmailAndPassword(): Login {
    const dispatch = useAuthDispatch();
    const authProvider = useAuthProvider();
    const notify = useNotify();
    const [loading, setLoading] = useState(false);
    const { navigate } = useNavigation();

    const login = useCallback(
        (params: any = {}, isGuestUser = false) => {
            setLoading(true);
            return authProvider
            .login({
                ...params,
                isGuestUser
            })
            .then((token) => {
                setLoading(false);
                dispatch({ type: 'SIGN_IN', token: token });
            })
            .catch((e) => {
                if (e.message == 'USER_NOT_FOUND') {
                    notify('Este usuario no está registrado', 'warning');
                    setLoading(false);
                    return;
                }

                if (e.message == 'INVALID_CREDENTIALS') {
                    notify('Contraseña inválida', 'warning');
                    setLoading(false);
                    return;
                }

                setLoading(false);
                notify('No fue posible iniciar sesión.', 'error');
            });
        },
        [authProvider, setLoading]
    );

    const loginWithoutProvider = useCallback((_, __) => {
        return Promise.resolve();
    }, []);

    return {
        login: authProvider ? login : loginWithoutProvider,
        loading
    };
}
