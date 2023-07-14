import { isArray, map } from 'lodash';
import useGetIdentity from '@modules/auth/application/use-get-identity';
import useFindUserRole from '@modules/user/application/roles/use-find-user-role';

export const permissionsConstants = {

    LIST_CATEGORIES: 'LIST_CATEGORIES',
    EDIT_CATEGORIES: 'EDIT_CATEGORIES',
    CREATE_CATEGORIES: 'CREATE_CATEGORIES',
    DELETE_CATEGORIES: 'DELETE_CATEGORIES',

    LIST_MALLS: 'LIST_MALLS',
    CREATE_MALLS: 'CREATE_MALLS',
    EDIT_MALLS: 'EDIT_MALLS',
    DELETE_MALLS: 'DELETE_MALLS',

    LIST_STORES: 'LIST_STORES',
    CREATE_STORES: 'CREATE_STORES',
    EDIT_STORES: 'EDIT_STORES',
    DELETE_STORES: 'DELETE_STORES',

    LIST_USERS_AND_ROLES: 'LIST_USERS_AND_ROLES',
    CREATE_USERS_AND_ROLES: 'CREATE_USERS_AND_ROLES',
    EDIT_USERS_AND_ROLES: 'EDIT_USERS_AND_ROLES',
    DELETE_USERS_AND_ROLES: 'DELETE_USERS_AND_ROLES',

    SEE_STATS: 'SEE_STATS',

    LIST_PROMOTIONS: 'LIST_PROMOTIONS',
    EDIT_PROMOTIONS: 'EDIT_PROMOTIONS',
    CREATE_PROMOTIONS: 'CREATE_PROMOTIONS',
    DELETE_PROMOTIONS: 'DELETE_PROMOTIONS'
};

export const permissionsConstantsDescriptions = [

    {
        group: 'Categorias',
        elements: {
            LIST_CATEGORIES: 'Ver categorias',
            EDIT_CATEGORIES: 'Editar categorias',
            CREATE_CATEGORIES: 'Crear categorias',
            DELETE_CATEGORIES: 'Eliminar categorias'
        }
    },
    {
        group: 'Plazas',
        elements: {
            LIST_MALLS: 'Ver plazas',
            CREATE_MALLS: 'Crear plazas',
            EDIT_MALLS: 'Editar plazas',
            DELETE_MALLS: 'Eliminar plazas'
        }
    },
    {
        group: 'Locales',
        elements: {
            LIST_STORES: 'Ver locales',
            CREATE_STORES: 'Crear locales',
            EDIT_STORES: 'Editar locales',
            DELETE_STORES: 'Eliminar locales'
        }
    },

    {
        group: 'Usuarios y Roles',
        elements: {
            LIST_USERS_AND_ROLES: 'Ver usuarios y roles',
            CREATE_USERS_AND_ROLES: 'Crear usuarios y roles',
            EDIT_USERS_AND_ROLES: 'Editar usuarios y roles',
            DELETE_USERS_AND_ROLES: 'Eliminar usuarios y roles'
        }
    },
    {
        group: 'Estadísticas',
        elements: {
            SEE_STATS: 'Ver estadísticas'
        }
    },
    {
        group: 'Promociones',
        elements: {
            LIST_PROMOTIONS: 'Ver promociones',
            EDIT_PROMOTIONS: 'Editar promociones',
            CREATE_PROMOTIONS: 'Crear promociones',
            DELETE_PROMOTIONS: 'Eliminar promociones'
        }
    }
];

let permissionsConstantsD = map(permissionsConstantsDescriptions, 'elements');

let flatten = {};
permissionsConstantsD.forEach((g) => {
    flatten = { ...flatten, ...g };
});

export const flattenPermissionsConstantsDescriptions = flatten;

export const useCheckPermission = () => {
    const { identity, loading: loadingIdentity } = useGetIdentity();
    const { data: role, loading } = useFindUserRole(identity?.roleId, { enabled: !!identity });
    const userPermissions = [
        ...role?.permissions ?? [],
        ...['ACCOUNT']
    ];

    return {
        ready: !loading && !loadingIdentity,
        check: (constant: string) => {
            return userPermissions &&
                (identity?.isSuperAdmin ||
                    (isArray(userPermissions) &&
                        userPermissions.indexOf(constant) !== -1));
        }
    };
};

