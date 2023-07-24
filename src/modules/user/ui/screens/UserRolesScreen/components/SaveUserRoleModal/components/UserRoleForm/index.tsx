import { Form } from '@main-components/Form/Form';
import TextInput from '@main-components/Form/inputs/TextInput';
import { Box } from '@main-components/Base/Box';
import Text from '@main-components/Typography/Text';
import { required } from '@shared/domain/form/validate';
import useNotify from '@shared/domain/hooks/use-notify';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';
import UuidUtils from '@utils/misc/uuid-utils';
import React from 'react';
import useSaveUserRole from '@modules/user/application/roles/use-save-user-role';
import AdminRole from '@modules/user/domain/models/admin-role';
import { permissionsConstantsDescriptions } from '@modules/auth/infrastructure/providers/permissions';
import CheckboxGroupInput from '@main-components/Form/inputs/CheckboxGroupInput';
import BaseCheckboxItemInput from '@main-components/Form/inputs/CheckboxInput/components/BaseCheckboxItemInput';
import { useForm } from '@shared/domain/form/useForm';

interface UserRoleFormProps {
    id?: string;
    defaultValues?: any;
    onSave?: any;
    role?: AdminRole;
}

export default function UserRoleForm(props: UserRoleFormProps) {

    const defaultPermissions = props.role?.toPrimitives() ? permissionsConstantsDescriptions.map(obj => {
        const elements = Object.keys(obj.elements)
        .filter(key => props.role?.toPrimitives().permissions.includes(key));
        return elements;
    }) : [];


    return (
        <Form
            defaultValues={{
                ...props.defaultValues,
                ...props.role?.toPrimitives(),
                permissions: defaultPermissions
            }}
            toolbar={
                <FormToolbar
                    id={props.id}
                    onSave={props.onSave}
                />
            }
        >
            <BasicFormInputs editMode={!!props.id} />
        </Form>
    );
}

export function BasicFormInputs({ editMode }) {
    return (
        <>
            <Box
            >
                <Box
                    flex={0.5}
                    mr={'m'}
                >
                    <TextInput
                        required
                        validate={required()}
                        label={'Nombre'}
                        source={'name'}
                    />
                </Box>

                <PermissionsInput />

            </Box>
        </>
    );
}

function PermissionsInput() {
    return (
        <Box flexDirection={'column'}>
            {
                permissionsConstantsDescriptions.map((group, index) => {
                    const keys = Object.keys(group.elements);
                    return (
                        <Box>
                            <Section
                                title={group.group}
                                left={<SelectAllInGroup
                                    groupIndex={index}
                                    items={keys}
                                />}
                            />
                            <CheckboxGroupInput
                                key={index}
                                source={`permissions[${index}]`}
                                choices={keys.map((key) => {
                                    return {
                                        id: key,
                                        name: group.elements[key]
                                    };
                                })}
                            />
                        </Box>
                    );
                })
            }
        </Box>
    );
}

function FormToolbar(props) {
    const { execute: save, loading } = useSaveUserRole();
    const notify = useNotify();

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

                    const finalPermissions = data.permissions.flatMap((p) => p).filter((f) => !!f);
                    try {
                        const user = AdminRole.fromPrimitives({
                            id: props?.id ?? UuidUtils.persistenceUuid(),
                            name: data.name,
                            permissions: finalPermissions,
                            status: props?.id ? 'ACTIVE' : data.status
                        });

                        await save(user);

                        props?.onSave?.();

                        notify('Guardado exitosamente', 'success');
                    } catch (e) {
                        props?.onSave?.();
                        notify('Lo sentimos, ha ocurrido un error inseperado.', 'error');
                    }
                }}
            />
        </Box>
    );
}

function SelectAllInGroup({ groupIndex, items }) {
    const { setValue, watch } = useForm();
    const elements = watch('permissions');
    const isChecked = elements?.[groupIndex]?.length === items.length;

    return (
        <BaseCheckboxItemInput
            title={''}
            checked={isChecked}
            value={isChecked}
            onChange={(value) => {
                setValue(`permissions[${groupIndex}]`, !!value ? items : []);
            }}
        />
    );
}

function Section({ title, left }: { title: string, left: any }) {
    return (
        <Box
            marginVertical={'m'}
            flexDirection={'row'}
            justifyContent={'space-between'}
        >
            <Box>
                <Text
                    bold
                    variant={'body'}
                >{title}</Text>

            </Box>

            <Box>
                {left}
            </Box>
        </Box>
    );
}