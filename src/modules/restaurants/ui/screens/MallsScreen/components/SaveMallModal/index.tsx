import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import useFindRestaurantMall from '@modules/restaurants/application/malls/use-find-restaurant-mall';
import MallForm from '@modules/restaurants/ui/screens/MallsScreen/components/SaveMallModal/components/MallForm';

interface SaveMallModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string | undefined
        defaultValues?: any
    }
}

export default function SaveMallModal(props: SaveMallModalProps) {
    const { data: item, loading } = useFindRestaurantMall(props.form?.id ?? '', {
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
                            title={props?.form?.id ? 'Modificar Plaza' : 'Agregar Plaza'}
                            onClose={props.modal.onDismiss}
                            loading={loading}
                    />
                    <MallForm
                            id={props.form.id}
                            defaultValues={props.form.defaultValues ?? {
                                ...item ?? {}
                            }}
                            onSave={() => {
                                props?.modal.onDismiss?.();
                            }}
                    />
                </Box>
            </Modal>
    );
}