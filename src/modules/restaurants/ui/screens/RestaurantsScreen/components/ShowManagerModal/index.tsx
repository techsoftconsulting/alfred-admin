import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import React from 'react';
import useFindRestaurant from '@modules/restaurants/application/use-find-restaurant';
import { ListItem } from '@main-components/Base/List';
import { ActivityIndicator } from '@main-components/Base/ActivityIndicator';

interface SaveManagerModalProps {
    modal: Partial<ModalProps>,
    id?: string;
    store?: {
        id: string,
        type: string
        name: string;
        managerId: string;
    }
}

export default function ShowManagerModal(props: SaveManagerModalProps) {

    const { data: store, loading } = useFindRestaurant(props.store?.id ?? '', {
        enabled: !!props.store?.id
    });

    const manager = store?.manager;

    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        maxWidth: 500
                    }}
            >
                <Box>
                    <ModalHeader
                            title={`Usuario principal`}
                            onClose={props.modal.onDismiss}
                            loading={false}
                    />
                </Box>

                {
                    loading ? (
                            <Box
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    minHeight={200}
                            >
                                <ActivityIndicator />
                            </Box>
                    ) : (
                            <Box
                                    borderRadius={10}
                                    p={'m'}
                                    borderWidth={1}
                                    borderColor={'greyMedium'}
                            >
                                <ListItem
                                        titleStyle={{
                                            fontWeight: 'bold'
                                        }}
                                        title={'Email'}
                                        description={manager?.email}
                                />
                                <ListItem
                                        titleStyle={{
                                            fontWeight: 'bold'
                                        }}
                                        title={'Nombre'}
                                        description={manager?.firstName}
                                />
                                <ListItem
                                        titleStyle={{
                                            fontWeight: 'bold'
                                        }}
                                        title={'Apellido'}
                                        description={manager?.lastName}
                                />

                            </Box>
                    )
                }

            </Modal>
    );

}

