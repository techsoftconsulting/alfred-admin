import { Box } from '@main-components/Base/Box';
import useInput from '@shared/domain/form/useInput';
import { Icon } from '@main-components/Base/Icon';
import Text from '@main-components/Typography/Text';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import { BaseInput } from '@main-components/Form/inputs/BaseInput';
import BaseTextInput from '@main-components/Form/inputs/TextInput/components/BaseTextInput';
import BaseSelectPickerInput from '@main-components/Form/inputs/SelectInput/components/BaseSelectPickerInput';
import { useState } from 'react';
import useFormFieldErrors from '@shared/domain/form/use-form-field-errors';
import { isValidEmail } from '@shared/domain/form/validate';

export default function RestaurantManagersInput(props) {

    const { input } = useInput({
        defaultValue: props.defaultValue,
        validate: props.validate,
        source: props.source as string
    });
    const { hasError, error } = useFormFieldErrors(props.source as string);

    return (
        <BaseInput
            error={error}
            WrapperComponent={Box}

        >
            <Box
                gap={'m'}

            >
                {
                    input.value?.map((el, idx) => {
                        return (
                            <ManagerItem
                                key={idx}
                                number={idx + 1}
                                item={el}
                                onChange={(item) => {
                                    input.onChange(input.value?.map(e => {
                                        if (e.id == el.id) {
                                            return {
                                                ...e,
                                                ...item
                                            };
                                        }

                                        return e;
                                    }));
                                }}
                                onDelete={() => {
                                    input.onChange(input.value?.filter(e => el.id !== e.id));
                                }}
                            />
                        );
                    })
                }
                {/*<AddItem
                            onPress={() => {
                                input.onChange([
                                    ...input.value ?? [],
                                    {
                                        id: UuidUtils.persistenceUuid(),
                                        firstName: '',
                                        lastName: '',
                                        email: '',
                                        password: ''
                                    }
                                ]);
                            }}
                    />
*/}
            </Box>
        </BaseInput>
    );
}

function AddItem({ onPress }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Box
                borderRadius={10}
                height={20}
                p={'m'}
                borderWidth={1}
                borderColor={'primaryMain'}
                alignItems={'center'}
                justifyContent={'center'}
                style={{
                    borderStyle: 'dotted'
                }}
                bg={'greyLight'}
                flexDirection={'row'}
            >
                <Box mr={'m'}>
                    <Icon
                        name={'plus'}
                        numberSize={20}
                        color={'primaryMain'}
                    />
                </Box>
                <Box>
                    <Text>Agregar nuevo</Text>
                </Box>
            </Box>
        </TouchableOpacity>
    );
}

function ManagerItem({ item, number, onChange, onDelete }) {
    const [visiblePassword, setVisiblePassword] = useState(false);

    return (
        <Box
            alignItems={'center'}
            flexDirection={'row'}
        >

            <Box
                flex={1}
                borderRadius={10}
                key={item.id}
                flexDirection={'column'}
                gap={'s'}
                p={'m'}
                borderWidth={1}
                borderColor={'primaryMain'}
            >
                {/* <Box width={40}>
                        <Box
                                ml={'s'}
                                width={30}
                                height={30}
                                borderRadius={30 / 2}
                                bg={'primaryMain'}
                                alignItems={'center'}
                                justifyContent={'center'}
                        >
                            <Text color={'white'}>{number}</Text>
                        </Box>
                    </Box>*/}

                <Box
                    flex={1}
                    gap={'s'}
                    flexDirection={'row'}
                >
                    <Box flex={1}>
                        <BaseInput noMargin>
                            <BaseTextInput
                                value={item?.firstName}
                                onChangeText={(el) => {
                                    onChange({
                                        ...item,
                                        firstName: el
                                    });
                                }}
                                placeholder={'Nombre'}
                            />
                        </BaseInput>
                    </Box>
                    <Box flex={1}>
                        <BaseInput noMargin>
                            <BaseTextInput
                                value={item?.lastName}
                                placeholder={'Apellido'}
                                onChangeText={(value) => {
                                    onChange({
                                        ...item,
                                        lastName: value
                                    });
                                }}
                            />
                        </BaseInput>
                    </Box>
                </Box>

                <Box flex={1}>
                    <BaseInput noMargin>
                        <BaseTextInput
                            value={item?.email}
                            placeholder={'Email'}
                            onChangeText={(value) => {
                                onChange({
                                    ...item,
                                    email: value
                                });
                            }}
                        />
                    </BaseInput>
                </Box>
                <Box flex={1}>
                    <BaseInput noMargin>
                        <BaseTextInput
                            secureTextEntry={!visiblePassword}
                            value={item?.password}
                            rightIcon={{
                                name: visiblePassword ? 'eye-outline' : 'eye-off-outline',
                                color: 'primaryMain',
                                size: 'm',
                                onPress: () => setVisiblePassword(!visiblePassword)
                            }}
                            onChangeText={(value) => {
                                onChange({
                                    ...item,
                                    password: value
                                });
                            }}
                            placeholder={'Clave'}
                        />
                    </BaseInput>
                </Box>
                <Box flex={1}>
                    <BaseInput noMargin>
                        <BaseSelectPickerInput
                            disabled
                            value={item?.role}
                            placeholder={'Rol'}
                            onChange={(value) => {
                                onChange({
                                    ...item,
                                    role: value
                                });
                            }}
                            choices={[
                                {
                                    id: 'ADMIN',
                                    name: 'Administrador'
                                },
                                {
                                    id: 'ADM_RESERV',
                                    name: 'Administrador de reservas'
                                }
                            ]}
                        />
                    </BaseInput>
                </Box>
            </Box>
            {/*   <Box
                        width={40}
                        ml={'s'}
                >
                    <IconButton
                            iconName={'trash'}
                            iconType={'ionicon'}
                            borderRadius={30}
                            onPress={onDelete}
                            backgroundColor={'dangerLightest'}
                            iconColor={'dangerMain'}
                    />

                </Box>*/}
        </Box>
    );
}

export function isValidManagers() {
    return (values) => {
        const currentValues = values;

        if (!currentValues) {
            return 'Por favor, agrega al menos un usuario';
        }

        if (currentValues?.length == 0) {
            return 'Por favor, agrega al menos un usuario';
        }

        if (!currentValues?.some(v => v.role == 'ADMIN')) {
            return 'Por favor, agrega al menos un usuario administrador';
        }

        if (currentValues?.some(v => Object.values(v).some(a => a == '' || !a))) {
            return 'Todos los campos son requeridos';
        }

        if (currentValues?.some(v => {
            return !isValidEmail(v.email);
        })) {
            return 'Email inválido';
        }

        if (currentValues?.some(v => v.password?.length < 8)) {
            return 'La clave debe contener al menos 8 dígitos';
        }

        return undefined;
    };
}