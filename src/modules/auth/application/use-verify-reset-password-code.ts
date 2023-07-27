import useRepository from '@shared/domain/hooks/use-repository';
import { useState } from 'react';
import AuthUserRepository from '../domain/repositories/auth-user-repository';

export default function useVerifyResetPasswordCode() {
    const userRepo = useRepository<AuthUserRepository>('AuthUserRepository');
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(true);

    return {
        verifyCode: async (params: { email: string; code: string }) => {
            setLoaded(false);
            setLoading(true);
            try {
                setLoaded(true);

                await userRepo.verifyResetPasswordCode(params);

                setLoading(false);

            } catch (error) {
                setLoading(false);
                throw new Error(error.message);
            } finally {
                setLoading(false);
            }
        },
        loading,
        loaded
    };
}
