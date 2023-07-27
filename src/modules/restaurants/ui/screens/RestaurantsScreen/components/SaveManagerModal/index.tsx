import { Modal, ModalHeader, ModalProps } from '@main-components/Base/Modal';
import { Box } from '@main-components/Base/Box';
import RestaurantManagersInput, {
    isValidManagers
} from '@modules/restaurants/ui/screens/RestaurantsScreen/components/SaveRestaurantModal/components/RestaurantForm/components/RestaurantManagersInput';
import React from 'react';
import UuidUtils from '@utils/misc/uuid-utils';
import { Form } from '@main-components/Form/Form';
import useSaveRestaurantManager from '@modules/restaurants/application/use-save-restaurant-manager';
import useNotify from '@shared/domain/hooks/use-notify';
import { useForm } from '@shared/domain/form/useForm';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';
import RestaurantManager from '@modules/restaurants/domain/models/restaurant-manager';

interface SaveManagerModalProps {
    modal: Partial<ModalProps>,
    form: {
        id?: string
        defaultValues?: any
    }
    store?: {
        id: string,
        type: string
        name: string
    }
}

export default function SaveManagerModal(props: SaveManagerModalProps) {
    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        maxWidth: 500
                    }}
            >
                <Box>
                    <ModalHeader
                            title={props.form.id ? `Crear usuario en ${props.store?.name}` : `Crear usuario en ${props.store?.name}`}
                            onClose={props.modal.onDismiss}
                            loading={false}
                    />
                </Box>

                <Form
                        defaultValues={{
                            ...props.form.defaultValues,
                            managers: [
                                {
                                    id: UuidUtils.persistenceUuid(),
                                    firstName: '',
                                    lastName: '',
                                    email: '',
                                    password: '',
                                    role: 'ADMIN'
                                }
                            ]
                        }}

                        toolbar={<FormToolbar
                                id={props?.form.id}
                                onSave={() => {
                                    props.modal?.onDismiss?.();
                                }}
                                store={props.store}
                        />}
                >

                    <RestaurantManagersInput
                            border={0}
                            source={'managers'}
                            label={'Usuarios'}
                            required
                            validate={isValidManagers()}
                    />
                </Form>

            </Modal>
    );

}


function FormToolbar(props) {
    const { execute: saveManager, loading: savingManager } =
            useSaveRestaurantManager();
    const notify = useNotify();
    const { setError } = useForm();

    return (
            <Box alignItems={'center'}>
                <SaveButton
                        {...props}
                        label='Guardar'
                        titleColor={'white'}
                        loading={savingManager}
                        backgroundColor={'primaryMain'}
                        uppercase={false}
                        icon={() => {
                            return <AppIcon
                                    name='save'
                                    size={20}
                                    color='white'
                            />;
                        }}
                        onSubmit={async (data) => {
                            if (!props.store) return;
                            const managerDto = data.managers?.[0];

                            if (!managerDto) return;

                            try {

                                const manager = RestaurantManager.fromPrimitives({
                                    id: managerDto.id ?? UuidUtils.persistenceUuid(),
                                    status: 'ACTIVE',
                                    role: managerDto.role,
                                    lastName: managerDto.lastName,
                                    firstName: managerDto.firstName,
                                    email: managerDto.email,
                                    restaurantId: props.store.id,
                                    storeType: props.store.type,
                                    credentials: {
                                        email: managerDto.email,
                                        password: managerDto.password
                                    }
                                });


                                await saveManager(manager);

                                props?.onSave?.();

                                notify('Guardado exitosamente', 'success');
                            } catch (e) {

                                props?.onSave?.();

                                if (e.message === 'MANAGER_ALREADY_EXISTS') {
                                    notify('Ya existe una cuenta con el email: ' + managerDto.email, 'error');
                                    return;
                                }

                                if (e.message === 'USER_ALREADY_EXISTS') {
                                    notify('Ya existe una cuenta con el email: ' + managerDto.email, 'error');
                                    return;
                                }


                                notify('Lo sentimos, ha ocurrido un error inseperado.', 'error');
                            }
                        }}
                />
            </Box>
    );
}
