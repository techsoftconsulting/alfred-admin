import AppIcon from '@main-components/Base/AppIcon';
import { Box } from '@main-components/Base/Box';
import SaveButton from '@main-components/Form/components/SaveButton';
import { Form } from '@main-components/Form/Form';
import Text from '@main-components/Typography/Text';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import useSaveRestaurant from '@modules/restaurants/application/use-save-restaurant';
import Restaurant from '@modules/restaurants/domain/models/restaurant';
import RestaurantRepository from '@modules/restaurants/domain/repositories/restaurant-repository';
import {
    RestaurantBasicFormInputs
} from '@modules/restaurants/ui/screens/RestaurantsScreen/components/SaveRestaurantModal/components/RestaurantForm';
import { useForm } from '@shared/domain/form/useForm';
import useNotify from '@shared/domain/hooks/use-notify';
import useRepository from '@shared/domain/hooks/use-repository';
import React, { useState } from 'react';

interface RestaurantFormProps {
    id?: string;
    restaurant?: Restaurant;
    defaultValues?: any;
    onSave?: any;
}

export default function EditRestaurantForm(props: RestaurantFormProps) {
    const [activeSection, setActiveSection] = useState('details');

    return (
            <Box>
                {/*  <HeaderOptions
                        selectedItem={activeSection}
                        onItemPress={(section) => {
                            setActiveSection(section);
                        }}
                />*/}

                {activeSection == 'details' && (
                        <BasicDetailsForm
                                restaurant={props.restaurant}
                                onSave={props.onSave}
                        />
                )}
                {/*  {
                        activeSection == 'users' && (
                                <RestaurantsManagersForm restaurantId={props.id} />
                        )
                }*/}
            </Box>
    );
}

function HeaderOptions({ selectedItem, onItemPress }) {
    function OptionItem({ selected, label, onPress }) {
        return (
                <TouchableOpacity onPress={onPress}>
                    <Box
                            borderRadius={20}
                            paddingHorizontal={'m'}
                            paddingVertical={'s'}
                            bg={selected ? 'primaryMain' : 'white'}
                            borderWidth={selected ? 0 : 1}
                            borderColor={'primaryMain'}
                    >
                        <Text color={selected ? 'white' : 'primaryMain'}>
                            {label}
                        </Text>
                    </Box>
                </TouchableOpacity>
        );
    }

    return (
            <Box
                    flexDirection={'row'}
                    gap={'m'}
                    mb={'m'}
                    justifyContent={'center'}
            >
                <OptionItem
                        selected={selectedItem == 'details'}
                        label={'Detalles'}
                        onPress={() => onItemPress('details')}
                />

                <OptionItem
                        selected={selectedItem == 'users'}
                        label={'Usuarios'}
                        onPress={() => onItemPress('users')}
                />
            </Box>
    );
}

function BasicDetailsForm(props) {
    return (
            <Form
                    defaultValues={{
                        ...props.restaurant?.toPrimitives()
                    }}
                    toolbar={
                        <FormToolbar
                                restaurant={props.restaurant}
                                id={props.restaurant?.id}
                                onSave={props.onSave}
                        />
                    }
            >
                <RestaurantBasicFormInputs
                        editMode
                        id={props.restaurant?.id}
                />
            </Form>
    );
}

function FormToolbar(props) {
    const { execute: save, loading } = useSaveRestaurant();
    const notify = useNotify();

    const foundRestaurant: Restaurant | null = props.restaurant;
    const { setError } = useForm();
    const repo = useRepository<RestaurantRepository>('RestaurantRepository');
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
                            if (!foundRestaurant) return;

                            if (!props.id) return;

                            try {
                                await repo.guardUniqueSlug(data.slug, props.id);

                                const restaurant = Restaurant.fromPrimitives({
                                    id: props?.id,
                                    name: data.name,
                                    coverImageUrl: foundRestaurant.coverImageUrl,
                                    logoUrl: foundRestaurant.logoUrl,
                                    slug: data.slug,
                                    status: 'ACTIVE',
                                    address: data.address,
                                    categoriesIds: data.categoriesIds,
                                    contactPhone: data.contactPhone,
                                    recommended: Boolean(data.recommended),
                                    description: data.description,
                                    createdAt: foundRestaurant.createdAt,
                                    schedule: data.schedule,
                                    available: foundRestaurant.available,
                                    type: foundRestaurant.type
                                });

                                await save(restaurant, {
                                    logoUrl: data.logoUrl,
                                    coverImageUrl: data.coverImageUrl
                                });

                                props?.onSave?.();

                                notify('Guardado exitosamente', 'success');
                            } catch (e) {
                                console.log(e);
                                if (e.message === 'SLUG_ALREADY_EXISTS') {
                                    setError('slug', {
                                        message: 'Código de local ya existe'
                                    });
                                    return;
                                }

                                props?.onSave?.();

                                if (e.message === 'MANAGER_ALREADY_EXISTS') {
                                    notify('Ya existe una cuenta con el email: ' + data.email, 'error');
                                    return;
                                }


                                if (e.message === 'USER_ALREADY_EXISTS') {
                                    notify('Ya existe una cuenta con el email: ' + data.email, 'error');
                                    return;
                                }

                                notify('Lo sentimos, ha ocurrido un error inseperado.', 'error');
                            }
                        }}
                />
            </Box>
    );
}

