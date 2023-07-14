import { Form } from '@main-components/Form/Form';
import TextInput from '@main-components/Form/inputs/TextInput';
import { Box } from '@main-components/Base/Box';
import { required } from '@shared/domain/form/validate';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';
import React from 'react';
import useSaveRestaurantCategory from '@modules/restaurants/application/categories/use-save-restaurant-category';
import UuidUtils from '@utils/misc/uuid-utils';
import useNotify from '@shared/domain/hooks/use-notify';
import SelectInput from '@main-components/Form/inputs/SelectInput';

interface CategoryFormProps {
    id?: string;
    defaultValues?: any;
    onSave: any;
}


export default function CategoryForm(props: CategoryFormProps) {

    return (
            <Form
                    defaultValues={props.defaultValues}
                    toolbar={
                        <FormToolbar
                                id={props.id}
                                onSave={props.onSave}
                        />
                    }
            >

                <Box
                        flexDirection={'column'}
                >
                    <Box>
                        <TextInput
                                required
                                validate={required()}
                                label={'Nombre'}
                                source={'name'}
                        />
                    </Box>
                    <Box>
                        <SelectInput
                                source={'type'}
                                validate={required()}
                                required
                                label={'Tipo'}
                                choices={[
                                    {
                                        id: 'VENDOR',
                                        name: 'Tienda departamental'
                                    },
                                    {
                                        id: 'RESTAURANT',
                                        name: 'Restaurante'
                                    }
                                ]}
                        />
                    </Box>

                </Box>
            </Form>
    );
}

function FormToolbar(props) {
    const { execute: save, loading } = useSaveRestaurantCategory();
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

                            await save({
                                id: props?.id ?? UuidUtils.persistenceUuid(),
                                name: data.name,
                                slug: data.slug,
                                status: 'ACTIVE'
                            });
                            props?.onSave?.();

                            notify('Categoría guardada exitosamente', 'success');
                        }}
                />
            </Box>
    );
}

