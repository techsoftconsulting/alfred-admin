import { Box } from '@main-components/Base/Box';
import { Icon } from '@main-components/Base/Icon';
import { IconButton } from '@main-components/Base/IconButton';
import { Image } from '@main-components/Base/Image';
import { Skeleton } from '@main-components/Base/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@main-components/Base/Table';
import { TableContainer } from '@main-components/Base/Table/Table.web';
import { Form } from '@main-components/Form/Form';
import SelectInput from '@main-components/Form/inputs/SelectInput';
import BaseSwitchInput from '@main-components/Form/inputs/SwitchInput/components/BaseSwitchInput';
import AppLayout from '@main-components/Layout/AppLayout';
import NoItems from '@main-components/Secondary/NoItems';
import Text from '@main-components/Typography/Text';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import useFindPromotions from '@modules/promotions/application/use-find-promotions';
import useRemovePromotion from '@modules/promotions/application/use-remove-promotion';
import useSavePromotion from '@modules/promotions/application/use-save-promotion';
import Promotion from '@modules/promotions/domain/models/promotion';
import SavePromotionModal from '@modules/promotions/ui/screens/PromotionsScreen/components/SavePromotionModal';
import useFindRestaurantMalls from '@modules/restaurants/application/malls/use-find-restaurant-malls';
import useFindRestaurants from '@modules/restaurants/application/use-find-restaurants';
import Restaurant from '@modules/restaurants/domain/models/restaurant';
import RestaurantMall from '@modules/restaurants/domain/models/restaurant-mall';
import RestaurantMallSelectInput from '@modules/restaurants/ui/components/RestaurantMallSelectInput';
import useConfirm from '@shared/domain/hooks/use-confirm';
import useNotify from '@shared/domain/hooks/use-notify';
import { useFocusEffect } from '@shared/domain/navigation/use-focus-effect';
import { useState } from 'react';
import ScrollView from '@main-components/Utilities/ScrollView';
import { useCheckPermission } from '@modules/auth/infrastructure/providers/permissions';

export default function PromotionsScreen() {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedMall, setSelectedMall] = useState(null);
    const [selectedAvailability, setSelectedAvailability] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const {
        data: promotions,
        loading,
        isRefetching,
        refetch
    } = useFindPromotions({
        type: selectedType,
        availability: selectedAvailability,
        mallId: selectedMall
    });
    const { data: malls, loading: loadingMalls } = useFindRestaurantMalls();
    const { data: restaurants, loading: loadingRestaurants } =
            useFindRestaurants();

    const { execute: removePromotion, loading: deleting } =
            useRemovePromotion();
    const confirm = useConfirm();
    const notify = useNotify();
    const { ready, check } = useCheckPermission();

    useFocusEffect(() => {
        refetch();
    });

    return (
            <AppLayout
                    title={'Promociones'}
                    loading={loading || isRefetching || deleting || !ready}
            >
                <Box
                        flex={1}
                        bg={'white'}
                >
                    <Box
                            mb={'m'}
                            g={'m'}
                            justifyContent={'flex-end'}
                            flexDirection={'row'}
                            alignItems={'center'}
                            flexWrap={'wrap'}
                    >

                        <Box
                                gap={'s'}
                                flexDirection={'row'}
                                flexWrap={'wrap'}
                                flex={1}
                                justifyContent={'flex-end'}
                        >
                            <Box width={200}>
                                <Form toolbar={null}>
                                    <SelectInput
                                            noMargin
                                            source={'available'}
                                            placeholder={'Tipo'}
                                            choices={[
                                                {
                                                    id: 'VENDOR',
                                                    name: 'Tiendas departamentales'
                                                },
                                                {
                                                    id: 'RESTAURANT',
                                                    name: 'Restaurantes'
                                                }
                                            ]}
                                            onChange={(itemId) => {
                                                setSelectedType(itemId);
                                            }}
                                    />
                                </Form>
                            </Box>

                            <Box width={200}>
                                <Form toolbar={null}>
                                    <SelectInput
                                            noMargin
                                            source={'available'}
                                            placeholder={'Disponibles'}
                                            choices={[
                                                {
                                                    id: 'ALL',
                                                    name: 'Todas'
                                                },
                                                {
                                                    id: 'AVAILABLE',
                                                    name: 'Disponibles'
                                                },
                                                {
                                                    id: 'NOT_AVAILABLE',
                                                    name: 'No disponibles'
                                                }
                                            ]}
                                            onChange={(itemId) => {
                                                setSelectedAvailability(itemId);
                                            }}
                                    />
                                </Form>
                            </Box>

                            <Box width={250}>
                                <Form toolbar={null}>
                                    <RestaurantMallSelectInput
                                            noMargin
                                            source={'mall'}
                                            placeholder={'Plaza'}
                                            onChange={(itemId) => {
                                                setSelectedMall(itemId);
                                            }}
                                    />
                                </Form>
                            </Box>
                        </Box>
                        {
                                check('CREATE_PROMOTIONS') && (
                                        <Box

                                        >
                                            <AddButton
                                                    onPress={() => {
                                                        setShowSaveModal(true);
                                                    }}
                                            />
                                        </Box>

                                )
                        }
                    </Box>

                    <ItemsList
                            loading={loading}
                            malls={malls ?? []}
                            restaurants={restaurants ?? []}
                            promotions={promotions ?? []}
                            onEditItem={(id) => {
                                setShowSaveModal(true);
                                setEditingItem(id);
                            }}
                            onDeleteItem={(id) => {
                                confirm({
                                    title: 'Eliminar Promoción',
                                    options: {
                                        confirmText: 'Sí',
                                        cancelText: 'No'
                                    },
                                    async onConfirm() {
                                        await removePromotion(id);
                                        notify('Eliminado con éxito', 'success');
                                    },
                                    content: '¿Estás seguro que deseas eliminar esta promoción?'
                                });
                            }}
                    />

                    <SavePromotionModal
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
    promotions,
    restaurants,
    onEditItem,
    malls,
    onDeleteItem
}: {
    loading: boolean;
    malls: RestaurantMall[];
    restaurants: Restaurant[];
    promotions: Promotion[];
    onEditItem: any;
    onDeleteItem: any;
}) {
    if (!loading && promotions.length == 0) {
        return (
                <NoItems
                        title={'Aqui estarán las promociones listadas'}
                        icon={
                            <Icon
                                    name={'ios-megaphone-outline'}
                                    type={'ionicon'}
                                    color={'greyMain'}
                                    numberSize={100}
                            />
                        }
                />
        );
    }

    return (
            <ScrollView>
                <Box
                        flex={1}
                        p={'s'}
                >
                    <Table BaseComponent={TableContainer}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Imagen promocional</TableCell>
                                <TableCell>Local</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Ubicación</TableCell>
                                <TableCell>Estatus</TableCell>
                                <TableCell style={{ width: 100 }}>Opciones</TableCell>
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
                                    promotions?.map((c) => {
                                        return (
                                                <TableRow key={c.id}>
                                                    <TableCell
                                                            style={{
                                                                width: 200
                                                            }}
                                                    >
                                                        <Box
                                                                width={150}
                                                                height={150 / 2}
                                                                borderRadius={8}
                                                                borderWidth={1}
                                                                borderColor={'greyMain'}
                                                                overflow={'hidden'}
                                                        >
                                                            <Image
                                                                    resizeMode={'cover'}
                                                                    style={{
                                                                        borderRadius: 8,
                                                                        width: 150,
                                                                        height: 150 / 2
                                                                    }}
                                                                    source={{
                                                                        uri: c.imageUrl
                                                                    }}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <RestaurantField
                                                                id={c.restaurantId}
                                                                restaurants={restaurants}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Text>{c.typeName}</Text>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Text>{c.name}</Text>
                                                    </TableCell>
                                                    <TableCell>
                                                        <MallsField
                                                                ids={c.mallsIds}
                                                                malls={malls}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusUpdate
                                                                source={'isActive'}
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
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </ScrollView>
    );
}

function StatusUpdate({ source, item }) {
    const value = item[source];

    const [isActive, setIsActive] = useState(value);

    const { execute: save, loading } = useSavePromotion();
    const { ready, check } = useCheckPermission();
    return (
            <BaseSwitchInput
                    value={isActive}
                    selectedColor={'successMain'}
                    disabled={!check('EDIT_PROMOTIONS')}
                    onChange={async (val) => {
                        if (!check('EDIT_PROMOTIONS')) return;
                        if (!item) return;
                        setIsActive(val);
                        item.updateInfo({
                            available: val
                        });

                        await save(item, {
                            imageUrl: item.imageUrl
                        });
                    }}
            />
    );
}

function MallsField({ ids, malls }) {
    const category = malls?.filter((c) => ids.includes(c.id));

    return <Text>{category?.map((e) => e.name).join(', ')}</Text>;
}

function RestaurantField({ id, restaurants }) {
    const restaurant = restaurants?.find((c) => id === c.id);

    return <Text>{restaurant?.name}</Text>;
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
    const { ready, check } = useCheckPermission();

    return (
            <Box
                    gap={'s'}
                    flexDirection={'row'}
            >
                {
                        check('EDIT_PROMOTIONS') && (
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
                        check('DELETE_PROMOTIONS') && (
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
