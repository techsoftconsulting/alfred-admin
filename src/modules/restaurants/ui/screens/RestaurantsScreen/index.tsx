import { Box } from '@main-components/Base/Box';
import { Icon } from '@main-components/Base/Icon';
import { IconButton } from '@main-components/Base/IconButton';
import { Image } from '@main-components/Base/Image';
import { Skeleton } from '@main-components/Base/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@main-components/Base/Table';
import { TableContainer } from '@main-components/Base/Table/Table.web';
import AppLayout from '@main-components/Layout/AppLayout';
import NoItems from '@main-components/Secondary/NoItems';
import Text from '@main-components/Typography/Text';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import useFindRestaurantCategories from '@modules/restaurants/application/categories/use-find-restaurant-categories';
import useFindRestaurants from '@modules/restaurants/application/use-find-restaurants';
import useRemoveRestaurant from '@modules/restaurants/application/use-remove-restaurant';
import Restaurant from '@modules/restaurants/domain/models/restaurant';
import RestaurantCategory from '@modules/restaurants/domain/models/restaurant-category';
import SaveRestaurantModal from '@modules/restaurants/ui/screens/RestaurantsScreen/components/SaveRestaurantModal';
import useConfirm from '@shared/domain/hooks/use-confirm';
import useNotify from '@shared/domain/hooks/use-notify';
import { useFocusEffect } from '@shared/domain/navigation/use-focus-effect';
import { useEffect, useState } from 'react';
import RestaurantMall from '@modules/restaurants/domain/models/restaurant-mall';
import useFindRestaurantMalls from '@modules/restaurants/application/malls/use-find-restaurant-malls';
import { Form } from '@main-components/Form/Form';
import RestaurantMallSelectInput from '@modules/restaurants/ui/components/RestaurantMallSelectInput';
import BaseSwitchInput from '@main-components/Form/inputs/SwitchInput/components/BaseSwitchInput';
import useSaveRestaurant from '@modules/restaurants/application/use-save-restaurant';
import ScrollView from '@main-components/Utilities/ScrollView';
import SelectInput from '@main-components/Form/inputs/SelectInput';
import { useCheckPermission } from '@modules/auth/infrastructure/providers/permissions';
import SaveManagerModal from '@modules/restaurants/ui/screens/RestaurantsScreen/components/SaveManagerModal';
import { useUtils } from '@shared/domain/hooks/use-utils';
import StoreOptionMenu from '@modules/restaurants/ui/screens/RestaurantsScreen/components/StoreOptionMenu';
import ShowManagerModal from '@modules/restaurants/ui/screens/RestaurantsScreen/components/ShowManagerModal';

export default function RestaurantsScreen() {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showManagerModal, setShowManagerModal] = useState(false);
    const [showManagerPreviewModal, setShowManagerViewModal] = useState(false);

    const [editingItem, setEditingItem] = useState(null);
    const [activeStore, setActiveStore] = useState(null);

    const [selectedMall, setSelectedMall] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const { data: restaurants, loading, isRefetching, refetch } = useFindRestaurants({
        mallId: selectedMall,
        type: selectedType
    });
    const { data: categories, loading: loadingCategories } = useFindRestaurantCategories();
    const { data: malls, loading: loadingMalls } = useFindRestaurantMalls();
    const { execute: removeRestaurant, loading: deleting } = useRemoveRestaurant();
    const confirm = useConfirm();
    const notify = useNotify();
    const { ready, check } = useCheckPermission();

    useFocusEffect(() => {
        refetch();
    });

    return (
            <AppLayout
                    title={'Locales'}
                    loading={loading || isRefetching || deleting || loadingCategories || loadingMalls || !ready}
            >
                <Box
                        flex={1}
                        bg={'white'}
                >
                    <Box
                            mb={'m'}
                            alignItems={'center'}
                            g={'m'}
                            justifyContent={'flex-end'}
                            flexDirection={'row'}
                    >

                        <Form toolbar={null}>
                            <Box
                                    flexDirection={'row'}
                                    gap={'m'}
                            >
                                <Box
                                        width={200}
                                >
                                    <SelectInput
                                            noMargin
                                            source={'type'}
                                            choices={[
                                                {
                                                    id: 'VENDOR',
                                                    name: 'Tienda departamental'
                                                },
                                                {
                                                    id: 'RESTAURANT',
                                                    name: 'Restaurante'
                                                }
                                            ]}
                                            placeholder={'Tipo'}
                                            onChange={(itemId) => {
                                                setSelectedType(itemId);
                                            }}
                                    />
                                </Box>
                                <Box
                                        width={200}
                                >
                                    <RestaurantMallSelectInput
                                            noMargin
                                            source={'mall'}
                                            placeholder={'Plaza'}
                                            onChange={(itemId) => {
                                                setSelectedMall(itemId);
                                            }}
                                    />
                                </Box>
                            </Box>

                        </Form>

                        {
                                check('CREATE_STORES') && (
                                        <AddButton
                                                onPress={() => {
                                                    setShowSaveModal(true);
                                                }}
                                        />
                                )
                        }
                    </Box>
                    <ScrollView>
                        <RestaurantsList
                                categories={categories ?? []}
                                malls={malls ?? []}
                                loading={loading}
                                restaurants={restaurants ?? []}
                                onEditItem={(id) => {
                                    setShowSaveModal(true);
                                    setEditingItem(id);
                                }}
                                onDeleteItem={(id) => {
                                    confirm({
                                        title: 'Eliminar local',
                                        options: {
                                            confirmText: 'Sí',
                                            cancelText: 'No'
                                        },
                                        async onConfirm() {
                                            await removeRestaurant(id);
                                            notify('Eliminado con éxito', 'success');
                                        },
                                        content:
                                                '¿Estás seguro que deseas eliminar este local?'
                                    });
                                }}
                                onOpenManagerModal={(res) => {
                                    setShowManagerModal(true);
                                    setActiveStore(res);
                                }}
                                onShowManager={(store) => {
                                    setShowManagerViewModal(true);
                                    setActiveStore(store);
                                }}
                        />
                    </ScrollView>

                    <SaveManagerModal
                            modal={{
                                visible: showManagerModal,
                                onDismiss() {
                                    setShowManagerModal(false);
                                    setActiveStore(null);
                                }
                            }}
                            form={{}}
                            store={activeStore}
                    />

                    <ShowManagerModal
                            modal={{
                                visible: showManagerPreviewModal,
                                onDismiss() {
                                    setShowManagerViewModal(false);
                                    setActiveStore(null);
                                }
                            }}
                            store={activeStore}
                    />
                    <SaveRestaurantModal
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

function RestaurantsList({
    loading,
    restaurants,
    onEditItem,
    categories,
    malls,
    onDeleteItem,
    onShowManager,
    onOpenManagerModal
}: {
    loading: boolean;
    categories: RestaurantCategory[];
    malls: RestaurantMall[];
    restaurants: Restaurant[];
    onEditItem: any;
    onDeleteItem: any;
    onOpenManagerModal: any,
    onShowManager: any
}) {

    const utils = useUtils();
    const notify = useNotify();
    if (!loading && restaurants.length == 0) {
        return (
                <NoItems
                        title={'Aqui estarán los locales listados'}
                        icon={
                            <Icon
                                    name={'list'}
                                    type={'feather'}
                                    color={'greyMain'}
                                    numberSize={100}
                            />
                        }
                />
        );
    }

    return (
            <Table BaseComponent={TableContainer}>
                <TableHead>
                    <TableRow>
                        <TableCell>Logo</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Tel Contacto</TableCell>
                        <TableCell>Acceso</TableCell>
                        <TableCell>Plaza</TableCell>
                        <TableCell>Categorías</TableCell>
                        <TableCell>Estatus</TableCell>
                        <TableCell>Opciones</TableCell>
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
                                    <TableCell>
                                        <Skeleton
                                                loading
                                                type={'rectangle'}
                                                height={30}
                                        />
                                    </TableCell>
                                </TableRow>
                        ) : (
                                restaurants?.map((r) => {

                                    return (
                                            <TableRow key={r.id}>
                                                <TableCell
                                                        style={{
                                                            width: 80
                                                        }}
                                                >
                                                    <Box
                                                            width={80}
                                                            height={80}
                                                            borderRadius={40}
                                                            borderWidth={1}
                                                            borderColor={'primaryMain'}
                                                            overflow={'hidden'}
                                                    >
                                                        <Image
                                                                resizeMode={'cover'}
                                                                style={{
                                                                    borderRadius: 40,
                                                                    width: 80,
                                                                    height: 80
                                                                }}
                                                                source={{
                                                                    uri: r.logoUrl
                                                                }}
                                                        />
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Text>{r.name}</Text>
                                                </TableCell>
                                                <TableCell>
                                                    <Text>{r.typeName}</Text>
                                                </TableCell>
                                                <TableCell>
                                                    <Text>{r.contactPhone}</Text>
                                                </TableCell>

                                                <TableCell>
                                                    <Box
                                                            width={'fit-content'}
                                                            bg='greyDark'
                                                            borderRadius={20}
                                                            p={'xs'}
                                                            paddingHorizontal={'m'}
                                                    >
                                                        <TouchableOpacity
                                                                onPress={() => {
                                                                    utils.clipboard.copyToClipboard(r.accessUrl);
                                                                    notify('Enlace copiado al portapapeles', 'success', undefined, undefined, 1000);
                                                                }}
                                                        >
                                                            <Box
                                                                    gap={'s'}
                                                                    alignItems={'center'}
                                                                    flexDirection={'row'}
                                                            >
                                                                <Box>
                                                                    <Icon
                                                                            name={'link'}
                                                                            type={'entypo'}
                                                                            numberSize={14}
                                                                            color={'white'}
                                                                    />
                                                                </Box>
                                                                <Box>
                                                                    <Text
                                                                            numberOfLines={1}
                                                                            variant={'small'}
                                                                            color={'white'}
                                                                    >{r.slug}</Text>
                                                                </Box>

                                                            </Box>

                                                        </TouchableOpacity>

                                                    </Box>

                                                </TableCell>

                                                <MallField
                                                        malls={malls}
                                                        id={r.mallId}
                                                />

                                                <CategoryField
                                                        categories={categories}
                                                        ids={r.categoriesIds ?? []}
                                                />

                                                <TableCell>
                                                    <StatusUpdate
                                                            source={'available'}
                                                            item={r}
                                                    />
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
                                                            onOpenManagerModal={() => {
                                                                onOpenManagerModal({
                                                                    id: r.id,
                                                                    name: r.name,
                                                                    type: r.type
                                                                });
                                                            }}
                                                            onShowManager={(managerId) => {
                                                                onShowManager({
                                                                    id: r.id,
                                                                    name: r.name,
                                                                    type: r.type,
                                                                    managerId: managerId
                                                                });
                                                            }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                    );
                                })
                        )}
                </TableBody>
            </Table>
    );
}

function StatusUpdate({ source, item }: { source: string, item: Restaurant }) {
    const value = item[source];

    const [isActive, setIsActive] = useState(value);

    useEffect(() => {
        setIsActive(value);
    }, [value]);

    const { execute: save, loading } = useSaveRestaurant();
    const { ready, check } = useCheckPermission();

    return (
            <BaseSwitchInput
                    value={isActive}
                    selectedColor={'successMain'}
                    disabled={!check('EDIT_STORES')}
                    onChange={async (val) => {
                        if (!check('EDIT_STORES')) return;
                        if (!item) return;
                        setIsActive(val);

                        await save(Restaurant.fromPrimitives({
                            ...item.toPrimitives(),
                            available: val
                        }), {});
                    }}
            />
    );
}

function CategoryField({ ids, categories }) {
    const category = categories?.filter(c => ids.includes(c.id));

    return (
            <TableCell>
                <Text>{category?.map(e => e.name).join(', ')}</Text>
            </TableCell>
    );
}


function MallField({ id, malls }) {
    const mall = malls?.find(c => c.id == id);

    return (
            <TableCell>
                <Text>{mall?.name}</Text>
            </TableCell>
    );
}


function RowOptions({
    entity,
    onEdit,
    onDelete,
    onOpenManagerModal,
    onShowManager
}: { entity: Restaurant, onShowManager: any; onEdit: any; onDelete: any, onOpenManagerModal: any }) {
    const { ready, check } = useCheckPermission();
    return (
            <Box
                    gap={'s'}
                    flexDirection={'row'}
            >
                {
                        check('EDIT_STORES') && (
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
                        check('DELETE_STORES') && (
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

                {
                        !entity.managerId && check('CREATE_STORES') && (
                                <IconButton
                                        onPress={() => {
                                            /*onDelete();*/
                                            onOpenManagerModal?.();
                                        }}
                                        iconType={'feather'}
                                        iconColor={'greyDark'}
                                        iconName={'user-plus'}
                                />
                        )
                }

                {
                        !!entity.managerId && check('CREATE_STORES') && (
                                <StoreOptionMenu
                                        renderTarget={({ onPress }) => {
                                            return (
                                                    <IconButton
                                                            onPress={onPress}
                                                            iconType={'entypo'}
                                                            iconColor={'greyDark'}
                                                            iconName={'dots-three-vertical'}
                                                    />
                                            );
                                        }}
                                        onItemPress={(id) => {
                                            onShowManager(entity.managerId);
                                        }}
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