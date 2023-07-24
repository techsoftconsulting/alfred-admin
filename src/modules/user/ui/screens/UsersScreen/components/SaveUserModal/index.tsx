import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import useFindUser from '@modules/user/application/use-find-user';
import UserForm from '@modules/user/ui/screens/UsersScreen/components/SaveUserModal/components/UserForm';
import Text from '@main-components/Typography/Text';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import { useEffect, useState } from 'react';
import ChangeUserPasswordForm
    from '@modules/user/ui/screens/UsersScreen/components/SaveUserModal/components/ChangeUserPasswordForm';

interface SaveRestaurantModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string
        defaultValues?: any
    }
}

export default function SaveUserModal(props: SaveRestaurantModalProps) {
    const { data: user, refetch, loading, isRefetching } = useFindUser(props.form?.id ?? '', {
        enabled: !!props.form?.id
    });

    const [selectedOption, setSelectedOption] = useState('details');

    useEffect(() => {
        setSelectedOption('details');
    }, [props.modal.visible]);
    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        maxWidth: 500
                    }}
            >
                <Box>
                    <ModalHeader
                            title={props.form.id ? 'Actualizar usuario' : 'Agregar usuario'}
                            onClose={props.modal.onDismiss}
                            loading={loading || isRefetching}
                    />

                    {
                            !!props.form.id && (
                                    <Box
                                            mb={'l'}
                                            flexDirection={'row'}
                                            gap={'m'}
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                    >
                                        <TouchableOpacity
                                                onPress={() => {
                                                    setSelectedOption('details');
                                                }}
                                        >
                                            <Box
                                                    borderRadius={20}
                                                    bg={selectedOption == 'details' ? 'primaryMain' : undefined}
                                                    p={'xs'}

                                                    paddingHorizontal={'m'}
                                                    width={'fit-content'}
                                            ><Text color={selectedOption == 'details' ? 'white' : undefined}>Detalles</Text></Box>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                                onPress={() => {
                                                    setSelectedOption('access');
                                                }}
                                        >
                                            <Box
                                                    borderRadius={20}
                                                    bg={selectedOption == 'access' ? 'primaryMain' : undefined}
                                                    p={'xs'}
                                                    paddingHorizontal={'m'}
                                                    width={'fit-content'}
                                            ><Text color={selectedOption == 'access' ? 'white' : undefined}>Acceso</Text></Box>
                                        </TouchableOpacity>

                                    </Box>
                            )
                    }
                    {
                            selectedOption == 'details' && (
                                    <UserForm
                                            id={props.form.id}
                                            user={props.form.id ? user : undefined}
                                            defaultValues={props.form.defaultValues}
                                            onSave={() => {
                                                props.modal?.onDismiss?.();
                                            }}
                                    />
                            )
                    }
                    {
                            selectedOption == 'access' && (
                                    <ChangeUserPasswordForm
                                            id={props.form.id}
                                            user={props.form.id ? user : undefined}
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