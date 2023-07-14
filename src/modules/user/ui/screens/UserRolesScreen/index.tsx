import { Box } from '@main-components/Base/Box';
import { Icon } from '@main-components/Base/Icon';
import { IconButton } from '@main-components/Base/IconButton';
import { Skeleton } from '@main-components/Base/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@main-components/Base/Table';
import { TableContainer } from '@main-components/Base/Table/Table.web';
import AppLayout from '@main-components/Layout/AppLayout';
import NoItems from '@main-components/Secondary/NoItems';
import Text from '@main-components/Typography/Text';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import useConfirm from '@shared/domain/hooks/use-confirm';
import useNotify from '@shared/domain/hooks/use-notify';
import { useFocusEffect } from '@shared/domain/navigation/use-focus-effect';
import { useState } from 'react';
import useGetIdentity from '@modules/auth/application/use-get-identity';
import ScrollView from '@main-components/Utilities/ScrollView';
import useFindUserRoles from '@modules/user/application/roles/use-find-user-roles';
import useRemoveUserRole from '@modules/user/application/roles/use-remove-user-role';
import AdminRole from '@modules/user/domain/models/admin-role';
import SaveUserRoleModal from '@modules/user/ui/screens/UserRolesScreen/components/SaveUserRoleModal';
import { useCheckPermission } from '@modules/auth/infrastructure/providers/permissions';

export default function UserRolesScreen() {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const { data: items, loading, isRefetching, refetch } = useFindUserRoles();
    const { execute: remove, loading: deleting } = useRemoveUserRole();
    const confirm = useConfirm();
    const notify = useNotify();

    const { ready, check } = useCheckPermission();

    useFocusEffect(() => {
        refetch();
    });

    return (
        <AppLayout
            title={'Roles'}
            loading={loading || isRefetching || deleting || !ready}
        >
            <Box
                flex={1}
                bg={'white'}
            >
                <Box
                    mb={'m'}
                    alignItems={'flex-end'}
                >
                    {
                        check('CREATE_USERS_AND_ROLES') && (
                            <AddButton
                                onPress={() => {
                                    setShowSaveModal(true);
                                }}
                            />
                        )
                    }
                </Box>

                <RolesList
                    loading={loading}
                    items={items ?? []}
                    onEditItem={(id) => {
                        setShowSaveModal(true);
                        setEditingItem(id);
                    }}
                    onDeleteItem={(id) => {
                        confirm({
                            title: 'Eliminar role',
                            options: {
                                confirmText: 'Sí',
                                cancelText: 'No'
                            },
                            async onConfirm() {
                                await remove(id);
                                notify('Eliminado con éxito', 'success');
                            },
                            content: '¿Estás seguro que deseas eliminar este role?'
                        });
                    }}
                />


                <SaveUserRoleModal
                    modal={{
                        visible: showSaveModal,
                        onDismiss() {
                            setEditingItem(null);
                            setShowSaveModal(false);
                        }
                    }}
                    form={{
                        id: editingItem
                    }}
                />
            </Box>
        </AppLayout>
    );
}

function RolesList({
    loading,
    items,
    onEditItem,
    onDeleteItem
}: {
    loading: boolean;
    items: AdminRole[];
    onEditItem: any;
    onDeleteItem: any;
}) {
    const { identity } = useGetIdentity();


    if (!loading && items.length == 0 || !identity) {
        return (
            <NoItems
                title={'Aqui estarán los roles listados'}
                icon={
                    <Icon
                        name={'user'}
                        type={'entypo'}
                        color={'greyMain'}
                        numberSize={100}
                    />
                }
            />
        );
    }

    return (
        <ScrollView>
            <Table BaseComponent={TableContainer}>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Opciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell>
                                <Skeleton
                                    loading
                                    type={'rectangle'}
                                    height={30}
                                />
                            </TableCell>
                            <TableCell>
                                <Skeleton
                                    loading
                                    type={'rectangle'}
                                    height={30}
                                />
                            </TableCell>
                        </TableRow>
                    ) : (
                        items?.map((r) => {
                            return (
                                <TableRow key={r.id}>
                                    <TableCell>
                                        <Text>{r.name}</Text>
                                    </TableCell>

                                    <TableCell style={{ width: 100 }}>
                                        <RowOptions
                                            entity={r}
                                            onEdit={() => {
                                                onEditItem(r.id);
                                            }}
                                            onDelete={() => {
                                                onDeleteItem(r.id);
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </ScrollView>
    );
}

function RowOptions({
    entity,
    onEdit,
    onDelete
}: {
    entity: any;
    onEdit: any;
    onDelete: any;
}) {
    const { identity } = useGetIdentity();
    const { ready, check } = useCheckPermission();
    return (
        <Box
            gap={'s'}
            flexDirection={'row'}
        >
            {
                (check('EDIT_USERS_AND_ROLES') && entity.id !== 'SUPER_ADMIN') && (
                    <IconButton
                        onPress={() => {
                            onEdit();
                        }}
                        iconType={'feather'}
                        iconColor={'greyDark'}
                        iconName={'edit'}
                    />
                )
            }


            {(check('DELETE_USERS_AND_ROLES') && identity?.roleId !== entity.id && entity.id !== 'SUPER_ADMIN') && (
                <IconButton
                    onPress={() => {
                        onDelete();
                    }}
                    iconType={'feather'}
                    iconColor={'greyDark'}
                    iconName={'trash'}
                />
            )}
        </Box>
    );
}

function AddButton({ onPress }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Box
                bg={'greyDark'}
                borderRadius={16}
                p={'m'}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Icon
                    name={'plus-circle-outline'}
                    type={'material-community-icons'}
                    numberSize={24}
                />
            </Box>
        </TouchableOpacity>
    );
}
