import { Form } from '@main-components/Form/Form';
import PasswordInput from '@main-components/Form/inputs/PasswordInput';
import { minLength, required } from '@shared/domain/form/validate';
import React from 'react';
import useNotify from '@shared/domain/hooks/use-notify';
import { Box } from '@main-components/Base/Box';
import SaveButton from '@main-components/Form/components/SaveButton';
import useSaveUser from '@modules/user/application/use-save-user';
import AdminUser from '@modules/user/domain/models/admin-user';

export default function ChangeUserPasswordForm({ user, id, onSave }) {
    return (
            <Form
                    defaultValues={{}}
                    toolbar={
                        <FormToolbar
                                id={id}
                                user={user}
                                onSave={() => {
                                    onSave();
                                }}
                        />
                    }
            >

                <PasswordInput
                        source='password'
                        required
                        placeholder='Escribe la nueva contraseña'
                        validate={[required(), minLength(8, 'Por favor, ingresa una clave de al menos 8 caracteres')]}
                        mode='rounded'
                        label='Nueva contraseña'
                />
            </Form>
    );
}


function FormToolbar(props) {

    const notify = useNotify();

    const { execute: saveUser, loading } = useSaveUser();


    return (
            <Box alignItems={'center'}>
                <SaveButton
                        {...props}
                        label='Cambiar clave'
                        titleColor={'white'}
                        disabled={loading || !props.id}
                        loading={loading}
                        backgroundColor={'primaryMain'}
                        uppercase={false}
                        onSubmit={async (data) => {
                            const user: AdminUser = props.user

                            if (!user) return;

                            try {
                                await saveUser(
                                        AdminUser.fromPrimitives({
                                            ...user.toPrimitives(),
                                            credentials: {
                                                email: user.email,
                                                password: data.password
                                            }
                                        })
                                );
                                props?.onSave?.();

                                notify('Clave ha sido guardada exitosamente', 'success');
                            } catch (e) {
                                notify('No fue posible actualizar la clave', 'error');

                            }

                        }}
                />

            </Box>
    );
}