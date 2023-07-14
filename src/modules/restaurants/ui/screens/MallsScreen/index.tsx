import { Box } from '@main-components/Base/Box';
import AppLayout from '@main-components/Layout/AppLayout';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@main-components/Base/Table';
import { TableContainer } from '@main-components/Base/Table/Table.web';
import Text from '@main-components/Typography/Text';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import { Icon } from '@main-components/Base/Icon';
import { useState } from 'react';
import { useFocusEffect } from '@shared/domain/navigation/use-focus-effect';
import { Skeleton } from '@main-components/Base/Skeleton';
import NoItems from '@main-components/Secondary/NoItems';
import { IconButton } from '@main-components/Base/IconButton';
import useConfirm from '@shared/domain/hooks/use-confirm';
import useNotify from '@shared/domain/hooks/use-notify';
import useFindRestaurantMalls from '@modules/restaurants/application/malls/use-find-restaurant-malls';
import useRemoveRestaurantMall from '@modules/restaurants/application/malls/use-remove-restaurant-mall';
import RestaurantMall from '@modules/restaurants/domain/models/restaurant-mall';
import SaveMallModal from '@modules/restaurants/ui/screens/MallsScreen/components/SaveMallModal';
import { Image } from '@main-components/Base/Image';
import BaseSwitchInput from '@main-components/Form/inputs/SwitchInput/components/BaseSwitchInput';
import useSaveRestaurantMall from '@modules/restaurants/application/malls/use-save-restaurant-mall';
import ObjectUtils from '@utils/misc/object-utils';
import { useCheckPermission } from '@modules/auth/infrastructure/providers/permissions';

export default function MallsScreen() {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const { data: items, loading, isRefetching, refetch } = useFindRestaurantMalls();
    const { execute: removeCategory, loading: deleting } = useRemoveRestaurantMall();
    const confirm = useConfirm();
    const notify = useNotify();
    const { ready, check } = useCheckPermission();

    useFocusEffect(() => {
        refetch();
    });

    return (
        <AppLayout
            title={'Plazas'}
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
                        check('CREATE_MALLS') && (
                            <AddButton
                                onPress={() => {
                                    setShowSaveModal(true);
                                }}
                            />
                        )
                    }

                </Box>

                <ItemsList
                    loading={loading}
                    items={items ?? []}
                    onEditItem={(id) => {
                        setShowSaveModal(true);
                        setEditingItem(id);
                    }}
                    onDeleteItem={(id) => {
                        confirm({
                            title: 'Eliminar plaza',
                            options: {
                                confirmText: 'Sí',
                                cancelText: 'No'
                            },
                            async onConfirm() {
                                await removeCategory(id);
                                notify('Eliminado con éxito', 'success');
                            },
                            content: '¿Estás seguro que deseas eliminar esta plaza?'
                        });
                    }}
                />


                <SaveMallModal
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

function ItemsList({
    loading,
    items,
    onEditItem,
    onDeleteItem
}: { loading: boolean; items: RestaurantMall[], onEditItem: any, onDeleteItem: any }) {


    if (!loading && items.length == 0) {
        return (
            <NoItems
                title={'Aqui estarán las plazas'}
                icon={<Icon
                    name={'workspaces-outline'}
                    type={'material'}
                    color={'greyMain'}
                    numberSize={100}
                />}
            />
        );
    }

    return (
        <Box
            flex={1}
            p={'s'}
            style={{
                overflow: 'auto'
            }}
        >
            <Table BaseComponent={TableContainer}>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Logo
                        </TableCell>
                        <TableCell>
                            Nombre
                        </TableCell>
                        <TableCell>
                            Estatus
                        </TableCell>
                        <TableCell style={{ width: 100 }}>
                            Opciones
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        loading ? (
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
                            items?.map(c => {
                                return (
                                    <TableRow key={c.id}>
                                        <TableCell
                                            style={{
                                                width: 200
                                            }}
                                        >
                                            <Box
                                                width={100}
                                                height={100}
                                                borderRadius={8}
                                                borderWidth={1}
                                                borderColor={'greyMain'}
                                                overflow={'hidden'}
                                            >
                                                <Image
                                                    resizeMode={'cover'}
                                                    style={{
                                                        borderRadius: 8,
                                                        width: 100,
                                                        height: 100
                                                    }}
                                                    source={{
                                                        uri: c.logoUrl
                                                    }}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Text>{c.name}</Text>
                                        </TableCell>
                                        <TableCell>
                                            <StatusUpdate
                                                source={'available'}
                                                item={c}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <RowOptions
                                                entity={c}
                                                onEdit={() => {
                                                    onEditItem(c.id);
                                                }}
                                                onDelete={() => {
                                                    onDeleteItem(c.id);
                                                }}
                                            />

                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )
                    }

                </TableBody>
            </Table>
        </Box>

    );
}


function StatusUpdate({ source, item }) {
    const value = item[source];

    const [isActive, setIsActive] = useState(value);

    const { execute: save, loading } = useSaveRestaurantMall();
    const { ready, check } = useCheckPermission();

    return (
        <BaseSwitchInput
            value={isActive}
            selectedColor={'successMain'}
            disabled={!check('EDIT_MALLS')}
            onChange={async (val) => {
                if (!check('EDIT_MALLS')) return;
                if (!item) return;
                setIsActive(val);

                await save(ObjectUtils.merge(item, {
                    available: val
                }), {
                    logoUrl: item.logoUrl
                });
            }}
        />
    );
}

function RowOptions({ entity, onEdit, onDelete }: { entity: any, onEdit: any; onDelete: any }) {
    const { ready, check } = useCheckPermission();
    return (
        <Box
            gap={'s'}
            flexDirection={'row'}
        >
            {
                check('EDIT_MALLS') && (
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
            {
                check('DELETE_MALLS') && (
                    <IconButton
                        onPress={() => {
                            onDelete();
                        }}
                        iconType={'feather'}
                        iconColor={'greyDark'}
                        iconName={'trash'}
                    />
                )
            }
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