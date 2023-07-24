import { Box } from '@main-components/Base/Box';
import AppLayout from '@main-components/Layout/AppLayout';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@main-components/Base/Table';
import { TableContainer } from '@main-components/Base/Table/Table.web';
import Text from '@main-components/Typography/Text';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import { Icon } from '@main-components/Base/Icon';
import SaveCategoryModal from '@modules/restaurants/ui/screens/CategoriesScreen/components/SaveCategoryModal';
import { useState } from 'react';
import useFindRestaurantCategories from '@modules/restaurants/application/categories/use-find-restaurant-categories';
import RestaurantCategory from '@modules/restaurants/domain/models/restaurant-category';
import { useFocusEffect } from '@shared/domain/navigation/use-focus-effect';
import { Skeleton } from '@main-components/Base/Skeleton';
import NoItems from '@main-components/Secondary/NoItems';
import { IconButton } from '@main-components/Base/IconButton';
import useRemoveRestaurantCategory from '@modules/restaurants/application/categories/use-remove-restaurant-category';
import useConfirm from '@shared/domain/hooks/use-confirm';
import useNotify from '@shared/domain/hooks/use-notify';
import ScrollView from '@main-components/Utilities/ScrollView';
import { useCheckPermission } from '@modules/auth/infrastructure/providers/permissions';
import { Form } from '@main-components/Form/Form';
import SelectInput from '@main-components/Form/inputs/SelectInput';

export default function CategoriesScreen() {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const { data: categories, loading, isRefetching, refetch } = useFindRestaurantCategories({
        type: selectedType
    });
    const { execute: removeCategory, loading: deleting } = useRemoveRestaurantCategory();
    const confirm = useConfirm();
    const notify = useNotify();
    const { ready, check } = useCheckPermission();
    useFocusEffect(() => {
        refetch();
    });

    return (
            <AppLayout
                    title={'Categorías'}
                    loading={loading || isRefetching || deleting || !ready}
            >
                <Box
                        flex={1}
                        bg={'white'}
                >
                    <Box
                            mb={'m'}
                            justifyContent={'flex-end'}
                            alignItems={'center'}
                            flexWrap={'wrap'}
                            flexDirection={'row'}
                            gap={'m'}
                    >
                        <Box>
                            <Form toolbar={null}>
                                <Box
                                        flexDirection={'row'}
                                        gap={'m'}
                                >
                                    <Box
                                            width={250}
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

                                </Box>
                            </Form>
                        </Box>

                        {
                                check('CREATE_CATEGORIES') && (
                                        <AddButton
                                                onPress={() => {
                                                    setShowSaveModal(true);
                                                }}
                                        />
                                )
                        }

                    </Box>

                    <CategoriesList
                            loading={loading}
                            categories={categories ?? []}
                            onEditItem={(id) => {
                                setShowSaveModal(true);
                                setEditingItem(id);
                            }}
                            onDeleteItem={(id) => {
                                confirm({
                                    title: 'Eliminar categoría',
                                    options: {
                                        confirmText: 'Sí',
                                        cancelText: 'No'
                                    },
                                    async onConfirm() {
                                        await removeCategory(id);
                                        notify('Eliminado con éxito', 'success');
                                    },
                                    content: '¿Estás seguro que deseas eliminar esta categoría?'
                                });
                            }}
                    />


                    <SaveCategoryModal
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

function CategoriesList({
    loading,
    categories,
    onEditItem,
    onDeleteItem
}: { loading: boolean; categories: RestaurantCategory[], onEditItem: any, onDeleteItem: any }) {


    if (!loading && categories.length == 0) {
        return (
                <NoItems
                        title={'Aqui estarán las categorias de locales'}
                        icon={<Icon
                                name={'category'}
                                type={'material'}
                                color={'greyMain'}
                                numberSize={100}
                        />}
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
                                <TableCell>
                                    Nombre
                                </TableCell>
                                <TableCell>
                                    Tipo
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
                                        </TableRow>
                                ) : (
                                        categories?.map(c => {
                                            return (
                                                    <TableRow key={c.id}>
                                                        <TableCell>
                                                            <Text>{c.name}</Text>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Text>{c.type === 'RESTAURANT' ? 'Restaurante' : 'Tienda departamental'}</Text>
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
            </ScrollView>

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
                        check('EDIT_CATEGORIES') && (
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
                        check('DELETE_CATEGORIES') && (
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