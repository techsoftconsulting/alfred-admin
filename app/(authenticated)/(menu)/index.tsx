import { Box } from '@main-components/Base/Box';
import { useEffect } from 'react';
import { useGetUserMenu, useMenuRoute } from './_layout';
import { useNavigation } from '@react-navigation/native';

export default function DashboardRoute() {
    const { navigate } = useNavigation();
    const { loaded, menu } = useGetUserMenu();
    const { get: getRoute } = useMenuRoute();

    useEffect(() => {
        if (!loaded) return;

        const firstItem = menu?.[0];

        if (!firstItem) return;

        const url = getRoute(firstItem);
        navigate(url);

    }, [loaded]);

    return (
            <Box>

            </Box>
    );
}