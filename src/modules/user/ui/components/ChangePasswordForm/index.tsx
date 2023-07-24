import { Form } from '@main-components/Form/Form';
import PasswordInput from '@main-components/Form/inputs/PasswordInput';
import { minLength, required } from '@shared/domain/form/validate';
import React from 'react';
import useNotify from '@shared/domain/hooks/use-notify';
import useGetIdentity from '@modules/auth/application/use-get-identity';
import { useForm } from '@shared/domain/form/useForm';
import useUpdatePassword from '@modules/user/application/use-update-password';
import { Box } from '@main-components/Base/Box';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';
import useFindUser from '@modules/user/application/use-find-user';

export default function ChangePasswordForm() {
    return (
            <Form
                    defaultValues={{}}
                    toolbar={
                        <FormToolbar
                                onSave={() => {

                                }}
                        />
                    }
            >
                <PasswordInput
                        source='oldPassword'
                        required
                        placeholder='Escribe tu contraseña actual'
                        validate={required()}
                        mode='rounded'
                        label='Contraseña actual'
                />

                <PasswordInput
                        source='password'
                        required
                        placeholder='Escribe tu nueva contraseña'
                        validate={[required(), minLength(8, 'Por favor, ingresa una clave de al menos 8 caracteres')]}
                        mode='rounded'
                        label='Contraseña nueva'
                />
            </Form>
    );
}


function FormToolbar(props) {

    const notify = useNotify();
    const { identity } = useGetIdentity();
    const { setError } = useForm();

    const { execute: updatePassword, loading } = useUpdatePassword();
    const { data: user } = useFindUser(identity?.id, { enabled: !!identity });

    return (
            <Box alignItems={'center'}>
                <SaveButton
                        {...props}
                        label='Guardar'
                        titleColor={'white'}
                        loading={loading}
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
                            if (!identity) return;
                            if (!user) return;

                            try {
                                await updatePassword(
                                        user,
                                        identity.email,
                                        data.oldPassword,
                                        data.password
                                );
                                props?.onSave?.();

                                notify('Tu clave ha sido guardada exitosamente', 'success');
                            } catch (e) {
                                if (e.message.toUpperCase() == 'INVALID_CREDENTIALS') {
                                    setError('oldPassword', {
                                        message: 'Clave inválida'
                                    });
                                    return;
                                }

                                console.log(e);
                            }

                        }}
                />

            </Box>
    );
}