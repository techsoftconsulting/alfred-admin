import React, { useState } from 'react';
import SaveButton from '@main-components/Form/components/SaveButton';
import { Box } from '@main-components/Base/Box';
import { Form } from '@main-components/Form/Form';
import Text from '@main-components/Typography/Text';
import { Modal } from '@main-components/Base/Modal';
import EmailTextInput from '@main-components/Form/inputs/EmailTextInput';
import { email, minLength, required } from '@shared/domain/form/validate';
import AppIcon from '@main-components/Base/AppIcon';
import { Icon } from '@main-components/Base/Icon';
import TextInput from '@main-components/Form/inputs/TextInput';
import PasswordInput from '@main-components/Form/inputs/PasswordInput';
import { Button } from '@main-components/Base/Button';
import useForgotPassword from '@modules/auth/application/use-forgot-password';
import useVerifyResetPasswordCode from '@modules/auth/application/use-verify-reset-password-code';
import useResetPassword from '@modules/auth/application/use-reset-password';
import { IconButton } from '@main-components/Base/IconButton';

export default function ForgotPasswordModal(props) {
    return (
            <Modal
                    {...props.modal}
                    contentContainerStyle={{
                        maxWidth: 500,
                        top: '30%'
                    }}
            >
                <Box
                        position={'absolute'}
                        top={5}
                        right={15}
                        zIndex={9999}
                >
                    <IconButton
                            iconName={'times'}
                            iconColor={'primaryMain'}
                            iconSize={20}
                            onPress={props.modal?.onDismiss}
                    />
                </Box>
                <Box
                        bg={'white'}
                        flex={1}
                        justifyContent={'center'}
                >
                    <StepController
                            onClose={() => {
                                props.modal?.onDismiss?.();
                            }}
                    />

                </Box>
            </Modal>
    );
}

function StepController({ onClose }) {
    const [data, setData] = useState({ email: '', code: '', newPassword: '' });
    const [currentState, setCurrentState] = useState('initial');
    const [error, setError] = useState(null);
    const { forgotPassword, loading: sendingEmail } = useForgotPassword();
    const { verifyCode, loading: verifying } = useVerifyResetPasswordCode();
    const { resetPassword, loading: resetting } = useResetPassword();

    const handlers = {
        send(data) {
            setError(null);
            return forgotPassword(data.email);
        },
        async validate(data) {
            setError(null);
            return verifyCode({
                email: data.email,
                code: data.code
            });
        },
        newPassword(data) {
            setError(null);
            return resetPassword({
                email: data.email,
                code: data.code,
                password: data.newPassword
            });
        }
    };

    function renderError(error) {
        return (
                <Box
                        alignItems={'center'}
                        mb={'l'}
                        backgroundColor={'dangerLightest'}
                        height={30}
                        justifyContent={'center'}
                        p={'m'}
                        marginHorizontal={'l'}
                        borderRadius={8}
                >
                    <Text color={'dangerMain'}>{error}</Text>
                </Box>
        );
    }

    const StateMap = {
        initial: (
                <>
                    <Form
                            toolbar={<FormToolbar
                                    title={'Enviar'}
                                    loading={sendingEmail}
                            />}
                            onSubmit={async (currentData) => {

                                try {
                                    const newData = {
                                        ...data,
                                        email: currentData.email?.trim()?.toLowerCase()
                                    };

                                    setData(newData);

                                    await handlers.send(newData);

                                    setCurrentState('validate');
                                } catch (e) {
                                    if (e.message == 'CREDENTIALS_NOT_FOUND') {
                                        setError('No pudimos encontrar un usuario con ese correo');
                                        return;
                                    }
                                    setError('Lo sentimos, no fue posible enviar el correo.');
                                }
                            }}
                    >

                        <AuthScreenTitle
                                icon={
                                    <AppIcon
                                            name={'envelope'}
                                            size={40}
                                            color={'primaryMain'}
                                    />
                                }
                                title={
                                    'Ingrese su correo electrónico para continuar'
                                }
                        />

                        <EmailTextInput
                                source='email'
                                placeholder='Escribe tu correo electrónico'
                                mode='rounded'
                                validate={[
                                    required(),
                                    email('Email inválido')
                                ]}
                                filterText={(text) => {
                                    return text?.replace(/ /g, '');
                                }}
                        />
                        {
                                !!error && renderError(error)
                        }
                        <Box
                                mb='xl'
                                mt='xs'
                                paddingHorizontal='l'
                                alignItems={'center'}
                        >
                            <Box
                                    flexDirection='row'
                                    justifyContent='center'
                                    alignItems='center'
                            >
                                <Box
                                        width={35}
                                        mr='s'
                                >
                                    <Icon
                                            name={'numeric'}
                                            numberSize={35}
                                            color={'greyDark'}
                                            type={'material-community-icons'}
                                    />
                                </Box>
                                <Box flex={1}>
                                    <Text
                                            color='greyMain'
                                            variant='body'
                                    >
                                        Te enviaremos un código de validación
                                    </Text>
                                </Box>
                            </Box>
                        </Box>
                    </Form>
                </>
        ),
        validate: (
                <Form
                        toolbar={<FormToolbar
                                title={'Validar código'}
                                loading={verifying}
                        />}
                        onSubmit={async (currentData) => {
                            try {
                                const newData = {
                                    ...data,
                                    code: currentData.code
                                };

                                setData(newData);
                                await handlers.validate(newData);
                                setCurrentState('newPassword');
                            } catch (e) {
                                if (e.message?.toLowerCase() == 'invalid_reset_token') {
                                    setError('El código es inválido');
                                    return;
                                }
                                setError('No fue posible validar el código');
                            }
                        }}
                >

                    <Box>
                        <AuthScreenTitle
                                icon={
                                    <Icon
                                            name={'numeric'}
                                            numberSize={40}
                                            color={'greyDark'}
                                            type={'material-community-icons'}
                                    />
                                }
                                title={
                                    'Introduce el código enviado a tu correo'
                                }
                        />

                        <Box
                                alignSelf={'center'}
                                width={'100%'}
                                maxWidth={85}
                        >
                            <TextInput
                                    filterText={(text) => {
                                        return text?.trim().slice(0, 6);
                                    }}
                                    source='code'
                                    placeholder='Código enviado'
                            />
                        </Box>

                        {
                                !!error && renderError(error)
                        }
                    </Box>
                </Form>

        ),
        newPassword: (
                <Form
                        toolbar={<FormToolbar
                                title={'Guardar'}
                                loading={resetting}
                        />}
                        onSubmit={async (currentData) => {
                            try {
                                await handlers.newPassword({
                                    ...data,
                                    newPassword: currentData.password
                                });
                                setCurrentState('success');
                            } catch (e) {
                                setError('No fue posible cambiar tu clave');
                            }

                        }}
                >
                    <Box>
                        <AuthScreenTitle
                                icon={
                                    <Icon
                                            name={'form-textbox-password'}
                                            numberSize={40}
                                            color={'greyDark'}
                                            type={'material-community-icons'}
                                    />
                                }
                                title={
                                    'Configura tu nueva clave'
                                }
                        />

                        <PasswordInput
                                source='password'
                                required
                                placeholder='Escribe tu nueva contraseña'
                                validate={[required(), minLength(8, 'Por favor, ingresa una clave de al menos 8 caracteres')]}
                                label='Nueva contraseña'
                        />

                        {
                                !!error && renderError(error)
                        }
                    </Box>
                </Form>
        ),
        success: (
                <Box
                        alignItems={'center'}
                        flex={1}
                        gap={'m'}
                >
                    <Box>
                        <Icon
                                name={'check-circle'}
                                color={'successMain'}
                                numberSize={80}
                        />
                    </Box>
                    <Text>Clave configurada exitosamente</Text>
                    <Box>
                        <Button
                                title={'Cerrar'}
                                onPress={onClose}
                        />
                    </Box>
                </Box>
        )
    };

    return (
            <Box>
                {StateMap[currentState]}
            </Box>
    );
}

function AuthScreenTitle({ title, icon }) {
    return (
            <Box
                    marginHorizontal={'m'}
                    mb={'m'}
            >
                <Box
                        justifyContent='center'
                        alignItems='center'
                        mb='s'
                >
                    {icon}
                </Box>
                <Box
                        paddingHorizontal='m'
                        mb='s'
                >
                    <Text
                            align='center'
                            bold
                    >
                        {title}
                    </Text>
                </Box>
            </Box>
    );
}


function FormToolbar({ title, onSubmit, ...props }: any) {

    return (
            <Box alignItems={'center'}>
                <SaveButton
                        {...props}
                        label={title ?? 'Guardar'}
                        titleColor={'white'}
                        loading={props.loading}
                        backgroundColor={'primaryMain'}
                        uppercase={false}
                        onSubmit={(data) => {
                            onSubmit(data);
                        }}
                />
            </Box>
    );
}
