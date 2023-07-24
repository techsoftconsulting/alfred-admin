import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import CategoryForm
    from '@modules/restaurants/ui/screens/CategoriesScreen/components/SaveCategoryModal/components/CategoryForm';
import useFindRestaurantCategory from '@modules/restaurants/application/categories/use-find-restaurant-category';

interface SaveCategoryModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string | undefined
        defaultValues?: any
    }
}

export default function SaveCategoryModal(props: SaveCategoryModalProps) {
    const { data: category, loading } = useFindRestaurantCategory(props.form?.id ?? '', {
        enabled: !!props?.form?.id
    });

    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        maxWidth: 400

                    }}
            >

                <Box
                        flex={1}
                >
                    <ModalHeader
                            title={props?.form?.id ? 'Modificar categoría' : 'Agregar categoría'}
                            onClose={props.modal.onDismiss}
                            loading={loading}
                    />
                    <CategoryForm
                            id={props.form.id}
                            defaultValues={props.form.defaultValues ?? {
                                ...category ?? {}
                            }}
                            onSave={() => {
                                props?.modal.onDismiss?.();
                            }}
                    />
                </Box>
            </Modal>
    );
}