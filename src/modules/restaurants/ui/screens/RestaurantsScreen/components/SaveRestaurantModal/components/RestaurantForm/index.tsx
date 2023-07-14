import AppIcon from '@main-components/Base/AppIcon';
import { Box } from '@main-components/Base/Box';
import SaveButton from '@main-components/Form/components/SaveButton';
import { Form } from '@main-components/Form/Form';
import CheckboxInput from '@main-components/Form/inputs/CheckboxInput';
import PhoneTextInput from '@main-components/Form/inputs/PhoneTextInput';
import TextInput from '@main-components/Form/inputs/TextInput';
import WeekScheduleInput, { isValidSchedule } from '@main-components/Form/inputs/WeekScheduleInput';
import Text from '@main-components/Typography/Text';
import useSaveRestaurant from '@modules/restaurants/application/use-save-restaurant';
import useSaveRestaurantManager from '@modules/restaurants/application/use-save-restaurant-manager';
import Restaurant from '@modules/restaurants/domain/models/restaurant';
import RestaurantManager from '@modules/restaurants/domain/models/restaurant-manager';
import RestaurantRepository from '@modules/restaurants/domain/repositories/restaurant-repository';
import RestaurantCategorySelectInput from '@modules/restaurants/ui/components/RestaurantCategorySelectInput';
import RestaurantMallSelectInput from '@modules/restaurants/ui/components/RestaurantMallSelectInput';
import {
    RestaurantCoverImageInput
} from '@modules/restaurants/ui/screens/RestaurantsScreen/components/SaveRestaurantModal/components/RestaurantForm/components/RestaurantCoverImageInput';
import {
    RestaurantLogoInput
} from '@modules/restaurants/ui/screens/RestaurantsScreen/components/SaveRestaurantModal/components/RestaurantForm/components/RestaurantLogoInput';
import RestaurantManagersInput, {
    isValidManagers
} from '@modules/restaurants/ui/screens/RestaurantsScreen/components/SaveRestaurantModal/components/RestaurantForm/components/RestaurantManagersInput';
import useRestaurantSlugFilter
    from '@modules/restaurants/ui/screens/RestaurantsScreen/hooks/use-restaurant-slug-filter';
import { useForm } from '@shared/domain/form/useForm';
import { required } from '@shared/domain/form/validate';
import useNotify from '@shared/domain/hooks/use-notify';
import useRepository from '@shared/domain/hooks/use-repository';
import UuidUtils from '@utils/misc/uuid-utils';
import React, { useEffect } from 'react';
import SelectInput from '@main-components/Form/inputs/SelectInput';

interface RestaurantFormProps {
    id?: string;
    defaultValues?: any;
    onSave?: any;
}

export default function RestaurantForm(props: RestaurantFormProps) {
    return (
            <Form
                    defaultValues={{
                        ...props.defaultValues,
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
                            id={props.id}
                            onSave={props.onSave}
                    />}
            >
                <RestaurantBasicFormInputs />

                <Section
                        title={'Accesos'}
                        subtitle={'Agrega un usuario administrador al local'}
                />

                <Box
                        flex={0.5}
                        flexDirection={'row'}
                >
                    <RestaurantManagersInput
                            source={'managers'}
                            label={'Usuarios'}
                            required
                            validate={isValidManagers()}
                    />
                </Box>
            </Form>
    );
}

export function RestaurantBasicFormInputs() {
    const { filter } = useRestaurantSlugFilter();
    return (
            <>
                <Section title={'Información básica'} />

                <Box
                        alignItems={'center'}
                        flexDirection={'row'}
                >
                    <Box flex={0.5}>
                        <RestaurantLogoInput
                                label={'Logo'}
                                helperText={'Aspecto 1:1. Min:250px x 250px'}
                        />
                    </Box>
                    <Box flex={0.5}>
                        <RestaurantCoverImageInput
                                label={'Cover'}
                                helperText={'Aspecto 2:1. Min: 800px x 400px'}
                        />
                    </Box>
                </Box>


                <Box
                        flexDirection={'row'}
                >
                    <Box
                            flex={0.5}
                            mr={'m'}
                    >
                        <SelectInput
                                required
                                validate={required()}
                                source={'type'}
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

                    <Box flex={0.5}>
                        <TextInput
                                required
                                validate={required()}
                                filterText={filter}
                                label={'Slug'}
                                placeholder={'Ej. rest-1'}
                                helperText={'Código único del local'}
                                source={'slug'}
                        />
                    </Box>
                </Box>


                <Box flexDirection={'row'}>
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

                    <Box flex={0.5}>
                        <PhoneTextInput
                                required
                                validate={required()}
                                label={'Teléfono'}
                                source={'contactPhone'}
                        />
                    </Box>
                </Box>


                <TextInput
                        multiline
                        required
                        validate={required()}
                        label={'Descripción'}
                        source={'description'}
                />

                <Section
                        title={'Publicidad y recomendación'}
                        subtitle={
                            'Destaca el local para que aparezca en la sección de recomendados'
                        }
                />

                <Box>
                    <CheckboxInput
                            source={'recommended'}
                            title={''}
                            required
                            label={'Recomendado'}
                    />
                </Box>

                <ScheduleSectionController />


                <Section title={'Categoría y ubicación'} />

                <Box flexDirection={'row'}>
                    <Box
                            mr={'m'}
                            flex={0.5}
                    >
                        <CategoryInputController />
                    </Box>

                    <Box flex={0.5}>
                        <RestaurantMallSelectInput
                                required
                                validate={required()}
                                label={'Ubicación (Plaza)'}
                                source={'address'}
                        />
                    </Box>
                </Box>
            </>
    );
}

function CategoryInputController() {
    const { watch, setValue } = useForm();
    const values = watch(['type']);


    useEffect(() => {
        setValue('categoriesIds', null);
    }, [values?.type]);

    return (
            <RestaurantCategorySelectInput
                    required
                    type={values?.type}
                    validate={required()}
                    label={'Categorías'}
                    source={'categoriesIds'}
            />
    );
}


function ScheduleSectionController() {
    return (
            <>
                <Section title={'Horarios y disponibilidad'} />

                <WeekScheduleInput
                        source={'schedule'}
                        label={'Disponibilidad'}
                        required
                        validate={isValidSchedule('Horario inválido')}
                />
            </>
    );
}

function FormToolbar(props) {
    const { execute: save, loading } = useSaveRestaurant();
    const { execute: saveManager, loading: savingManager } =
            useSaveRestaurantManager();
    const notify = useNotify();
    const { setError } = useForm();
    const repo = useRepository<RestaurantRepository>('RestaurantRepository');

    return (
            <Box alignItems={'center'}>
                <SaveButton
                        {...props}
                        label='Guardar'
                        titleColor={'white'}
                        loading={loading || savingManager}
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
                            const managerDto = data.managers?.[0];
                            if (!managerDto) return;

                            const createdAt = new Date();
                            const id = props?.id ?? UuidUtils.persistenceUuid();

                            try {

                                const manager = RestaurantManager.fromPrimitives({
                                    id: managerDto.id ?? UuidUtils.persistenceUuid(),
                                    status: 'ACTIVE',
                                    role: managerDto.role,
                                    lastName: managerDto.lastName,
                                    firstName: managerDto.firstName,
                                    email: managerDto.email,
                                    restaurantId: id,
                                    storeType: data.type,
                                    credentials: {
                                        email: managerDto.email,
                                        password: managerDto.password
                                    }
                                });

                                const restaurant = Restaurant.fromPrimitives({
                                    id: id,
                                    name: data.name,
                                    slug: data.slug,
                                    status: 'ACTIVE',
                                    createdAt: createdAt,
                                    recommended: Boolean(data.recommended),
                                    address: data.address,
                                    description: data.description,
                                    categoriesIds: data.categoriesIds,
                                    contactPhone: data.contactPhone,
                                    schedule: data.schedule,
                                    manager: manager.toPrimitives(),
                                    available: true,
                                    type: data.type
                                });

                                await repo.guardUniqueSlug(
                                        restaurant.slug,
                                        restaurant.id
                                );

                                await saveManager(manager);

                                await save(restaurant, {
                                    logoUrl: data.logoUrl,
                                    coverImageUrl: data.coverImageUrl
                                });

                                props?.onSave?.();

                                notify('Guardado exitosamente', 'success');
                            } catch (e) {
                                if (e.message === 'SLUG_ALREADY_EXISTS') {
                                    setError('slug', {
                                        message: 'Código de local ya existe'
                                    });
                                    return;
                                }

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

export function Section({
    title,
    subtitle
}: {
    title: string;
    subtitle?: string;
}) {
    return (
            <Box marginVertical={'l'}>
                <Text
                        bold
                        variant={'body'}
                >
                    {title}
                </Text>

                {subtitle && (
                        <Box mt={'s'}>
                            <Text
                                    color={'greyMain'}
                                    bold
                                    variant={'small'}
                            >
                                {subtitle}
                            </Text>
                        </Box>
                )}
            </Box>
    );
}
