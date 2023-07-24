import AppDrawer from '@main-components/Base/AppDrawer';
import AppDrawerContent from '@main-components/Base/AppDrawer/components/AppDrawerContent';
import { useTheme } from '@shared/ui/theme/AppTheme';
import { Icon, TableIcon } from '@main-components/Base/Icon';
import useGetIdentity from '@modules/auth/application/use-get-identity';
import useFindUserRole from '@modules/user/application/roles/use-find-user-role';

export const DRAWER_WIDTH = 320;
export const FOOTER_HEIGHT = 65;

const MENU_MAP = {
    'LIST_CATEGORIES': {
        route: 'categories',
        component: (
                <AppDrawer.Screen
                        name={'categories'}
                        options={{
                            drawerIcon: (props: any) => (
                                    <Icon
                                            name={'category'}
                                            type={'material'}
                                            color={props.color ?? 'white'}
                                            numberSize={20}
                                    />
                            ),
                            title: 'Categorías',
                            headerTitle: '',
                            headerShown: false
                        }}
                />
        )
    },
    'LIST_MALLS': {
        route: 'malls',
        component: (
                <AppDrawer.Screen
                        name={'malls'}
                        options={{
                            drawerIcon: (props: any) => (
                                    <Icon
                                            name={'workspaces-outline'}
                                            type={'material'}
                                            color={props.color ?? 'white'}
                                            numberSize={20}
                                    />
                            ),
                            title: 'Plazas',
                            headerTitle: '',
                            headerShown: false
                        }}
                />
        )
    },
    'LIST_STORES': {
        route: 'stores',
        component: (
                <AppDrawer.Screen
                        name={'stores'}
                        options={{
                            drawerIcon: (props: any) => (
                                    <TableIcon size={30} />
                            ),
                            title: 'Locales',
                            headerTitle: '',
                            headerShown: false
                        }}
                />
        )
    },
    'LIST_USERS': {
        route: 'users',
        component: (
                <AppDrawer.Screen
                        name={'users'}
                        options={{
                            drawerIcon: (props: any) => (
                                    <Icon
                                            name={'user'}
                                            type={'feather'}
                                            color={props.color ?? 'white'}
                                            numberSize={20}
                                    />
                            ),
                            title: 'Usuarios',
                            headerTitle: '',
                            headerShown: false
                        }}
                />
        )
    },
    'LIST_ROLES': {
        route: 'user-roles',
        component: (
                <AppDrawer.Screen
                        name={'user-roles'}
                        options={{
                            drawerIcon: (props: any) => (
                                    <Icon
                                            name={'user'}
                                            type={'feather'}
                                            color={props.color ?? 'white'}
                                            numberSize={20}
                                    />
                            ),
                            title: 'Roles',
                            headerTitle: '',
                            headerShown: false
                        }}
                />
        )
    },
    'SEE_STATS': {
        route: 'reports',
        component: (
                <AppDrawer.Screen
                        name={'reports'}
                        options={{
                            drawerIcon: (props: any) => (
                                    <Icon
                                            name={'ios-stats-chart'}
                                            type={'ionicon'}
                                            color={props.color ?? 'white'}
                                            numberSize={20}
                                    />
                            ),
                            title: 'Reportes',
                            headerTitle: '',
                            headerShown: false
                        }}
                />
        )
    },
    'LIST_PROMOTIONS': {
        route: 'promotions',
        component: (
                <AppDrawer.Screen
                        name={'promotions'}
                        options={{
                            drawerIcon: (props: any) => (
                                    <Icon
                                            name={'ios-megaphone-outline'}
                                            type={'ionicon'}
                                            color={props.color ?? 'white'}
                                            numberSize={20}
                                    />
                            ),
                            title: 'Promociones',
                            headerTitle: '',
                            headerShown: false
                        }}
                />
        )
    },
    'ACCOUNT': {
        route: 'account',
        component: (
                <AppDrawer.Screen
                        name={'account'}
                        options={{
                            drawerIcon: (props: any) => (
                                    <Icon
                                            name={'cog'}
                                            type={'font-awesome'}
                                            color={props.color ?? 'white'}
                                            numberSize={20}
                                    />
                            ),
                            title: 'Cuenta',
                            headerTitle: '',
                            headerShown: false
                        }}
                />
        )
    }
};

export function useGetUserMenu() {
    const { identity, loading } = useGetIdentity();
    const { data: role, loading: loadingRoles } = useFindUserRole(identity?.roleId, { enabled: !!identity });
    const userPermissions = [...role?.permissions ?? [], ...['ACCOUNT']];

    const menuKeys = Object.keys(MENU_MAP);

    if (loading || loadingRoles) {
        return {
            loaded: false,
            menu: []
        };
    }

    return {
        loaded: !loading && !loadingRoles,
        menu: identity?.isSuperAdmin ? menuKeys : userPermissions ? menuKeys.filter(el => userPermissions.includes(el)) : []
    };
}

export function useMenuRoute() {
    return {
        get(key: string) {
            return MENU_MAP[key]?.route as string;
        }
    };
}

export default function Layout() {
    const theme = useTheme();
    const { loaded, menu } = useGetUserMenu();

    const mappedMenu = Object.keys(MENU_MAP ?? {}).filter(menuKey => menu.includes(menuKey)).map(menu => {
        return MENU_MAP[menu].component;
    });

    return (
            <AppDrawer
                    drawerContent={(props) => <AppDrawerContent {...props} loading={!loaded} />}
                    screenOptions={{
                        headerShown: false,
                        drawerStyle: {
                            maxWidth: DRAWER_WIDTH,
                            position: 'fixed',
                            left: 0,
                            backgroundColor: theme.colors.primaryMain
                        },
                        sceneContainerStyle: {
                            left: DRAWER_WIDTH,
                            width: `calc(100% - ${DRAWER_WIDTH}px)`
                        },
                        drawerType: 'permanent'
                    }}
            >

                <AppDrawer.Screen
                        name={'index'}
                        options={{
                            headerTitle: '',
                            headerShown: false
                        }}
                />

                {mappedMenu}
            </AppDrawer>
    );
}

