import React, { useEffect } from 'react';
import theme from '@shared/ui/theme/AppTheme';
import AppUtilsProvider from '@shared/infrastructure/providers/app-utils-provider';
import AppDataProvider from '@shared/infrastructure/providers/app-data-provider';
import AppServiceProvider from '@shared/infrastructure/providers/app-service-provider';
import AppProvider from '@shared/infrastructure/providers/app-provider';
import NotificationController from '@main-components/Utilities/NotificationController';
import ConfirmController from '@main-components/Utilities/ConfirmModalController/ConfirmModalController';
import { Slot, useRouter, useSegments } from 'expo-router';
import useIsLoggedIn from '@modules/auth/application/use-is-logged-in';
import { useLoadAssets } from '@shared/domain/navigation/use-load-assets';
import useRestoreSession from '@modules/auth/application/use-restore-session';
import AppAuthProvider from '@modules/auth/infrastructure/providers/app-auth-provider';
import { Box } from '@main-components/Base/Box';
import Head from 'expo-router/head';
import Text from '@main-components/Typography/Text';
import { FOOTER_HEIGHT } from './(authenticated)/(menu)/_layout';
import useStartFirebase from '@shared/infrastructure/firebase/use-start-firebase';

export default function Layout() {
    return (
        <AppProvider
            theme={theme}
            utilsProvider={AppUtilsProvider}
            dataProvider={AppDataProvider}
            serviceProvider={AppServiceProvider}
            authProvider={new AppAuthProvider()}
        >
            <>
                <Head>
                    <link
                        href={`${__DEV__ ? '../public/' : ''}general.css`}
                        rel='stylesheet'
                    />
                    <link
                        href={`${__DEV__ ? '../public/' : ''}ReactCrop.css`}
                        rel='stylesheet'
                    />

                    <link
                        href={`${__DEV__ ? '../public/' : ''}resizable.css`}
                        rel='stylesheet'
                    />
                </Head>
                <AuthController>
                    <Slot />
                </AuthController>
                <NotificationController />
                <ConfirmController />
            </>
        </AppProvider>
    );
}

function AuthController({ children }) {
    useStartFirebase();
    const { loading: checkingUserAuthenticated, isLoggedIn } = useIsLoggedIn();
    const { loaded: assetsLoaded } = useLoadAssets();
    const { loading: restoringSession } = useRestoreSession();
    const router = useRouter();
    const segments = useSegments();
    const isSessionReady =
        !checkingUserAuthenticated && !restoringSession;
    const isReady = assetsLoaded && isSessionReady;
    const inAuthGroup = segments[0] === '(unauthenticated)';

    useEffect(() => {
        if (!isReady) return;

        if (!isLoggedIn) {
            router.replace('/login');
            return;
        }

        if (inAuthGroup) {
            router.replace('/');
        }

    }, [isReady, isLoggedIn, inAuthGroup]);

    if (!isReady) return <Box></Box>;

    return (
        <>
            {children}
            {
                isLoggedIn && (
                    <Footer />
                )
            }
        </>
    );

}

function Footer() {
    return (
        <Box
            bg={'primaryMain'}
            height={FOOTER_HEIGHT}
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            flexDirection={'row'}
            alignItems={'center'}
            paddingHorizontal={'l'}
            justifyContent={'space-between'}
        >
            <Box>
                <Text color={'white'}>Políticas de privacidad</Text>
            </Box>
            <Box>
                <Text
                    bold
                    color={'white'}
                >Powered By Alfred©</Text>
            </Box>
        </Box>
    );
}