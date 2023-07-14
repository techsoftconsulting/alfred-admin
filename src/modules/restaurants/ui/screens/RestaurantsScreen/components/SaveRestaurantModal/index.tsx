import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import RestaurantForm
    from '@modules/restaurants/ui/screens/RestaurantsScreen/components/SaveRestaurantModal/components/RestaurantForm';
import EditRestaurantForm
    from '@modules/restaurants/ui/screens/RestaurantsScreen/components/SaveRestaurantModal/components/EditRestaurantForm';
import useFindRestaurant from '@modules/restaurants/application/use-find-restaurant';

interface SaveRestaurantModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string
        defaultValues?: any
    }
}

export default function SaveRestaurantModal(props: SaveRestaurantModalProps) {
    const { data: restaurant, refetch, loading } = useFindRestaurant(props.form?.id ?? '', {
        enabled: !!props.form?.id
    });

    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        maxWidth: 800
                    }}
            >
                <Box>
                    <ModalHeader
                            title={props.form.id ? 'Actualizar local' : 'Agregar local'}
                            onClose={props.modal.onDismiss}
                            loading={loading}
                    />
                    {
                        !props.form.id ? (
                                <RestaurantForm
                                        id={props.form.id}
                                        defaultValues={props.form.defaultValues}
                                        onSave={() => {
                                            props.modal?.onDismiss?.();
                                        }}
                                />
                        ) : (
                                <EditRestaurantForm
                                        id={props.form.id}
                                        restaurant={restaurant}
                                        defaultValues={props.form.defaultValues}
                                        onSave={() => {
                                            props.modal?.onDismiss?.();
                                        }}
                                />
                        )
                    }

                </Box>
            </Modal>
    );
}