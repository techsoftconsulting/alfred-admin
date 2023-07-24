import { Form } from '@main-components/Form/Form';
import TextInput from '@main-components/Form/inputs/TextInput';
import { Box } from '@main-components/Base/Box';
import { required } from '@shared/domain/form/validate';
import SaveButton from '@main-components/Form/components/SaveButton';
import AppIcon from '@main-components/Base/AppIcon';
import React from 'react';
import UuidUtils from '@utils/misc/uuid-utils';
import useNotify from '@shared/domain/hooks/use-notify';
import useSaveRestaurantMall from '@modules/restaurants/application/malls/use-save-restaurant-mall';
import {
    MallLogoInput
} from '@modules/restaurants/ui/screens/MallsScreen/components/SaveMallModal/components/MallForm/components/MallLogoInput';

interface MallFormPropsFormProps {
    id?: string;
    defaultValues?: any;
    onSave: any;
}

export default function MallForm(props: MallFormPropsFormProps) {

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
                <MallLogoInput
                    label={'Logo'}
                    helperText={'Aspecto 1:1. Min:250px x 250px'}
                />

                <TextInput
                    required
                    validate={required()}
                    label={'Nombre'}
                    source={'name'}
                />
            </Box>
        </Form>
    );
}

function FormToolbar(props) {
    const { execute: save, loading } = useSaveRestaurantMall();
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
                        status: 'ACTIVE',
                        logoUrl: undefined,
                        available: true
                    }, {
                        logoUrl: data.logoUrl
                    });

                    props?.onSave?.();

                    notify('Plaza guardada exitosamente', 'success');
                }}
            />
        </Box>
    );
}

