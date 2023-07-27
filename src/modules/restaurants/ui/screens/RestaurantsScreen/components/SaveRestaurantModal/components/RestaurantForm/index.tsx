import AppIcon from '@main-components/Base/AppIcon';
import { Box } from '@main-components/Base/Box';
import SaveButton from '@main-components/Form/components/SaveButton';
import { Form } from '@main-components/Form/Form';
import CheckboxInput from '@main-components/Form/inputs/CheckboxInput';
import PhoneTextInput from '@main-components/Form/inputs/PhoneTextInput';
import TextInput from '@main-components/Form/inputs/TextInput';
import WeekScheduleInput from '@main-components/Form/inputs/WeekScheduleInput';
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
                <RestaurantBasicFormInputs id={props.id} />

                <Section
                        title={'Accesos'}
                        subtitle={'Agrega un usuario administrador al local'}

                />

                <CheckboxInput
                        source={'enableUser'}
                        title={'Asignar usuario'}
                />
                <ManagerController />
            </Form>
    );
}

function ManagerController() {
    const { watch } = useForm();
    const values = watch(['enableUser']);

    if (!values.enableUser) return <Box />;

    return (
            <Box>
                <Box
                        flex={0.5}
                        flexDirection={'row'}
                >
                    <RestaurantManagersInput
                            source={'managers'}
                            label={'Usuarios'}
                            validate={isValidManagers()}
                    />
                </Box>
            </Box>
    );
}

export function RestaurantBasicFormInputs({ id }) {

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
                        gap={'m'}
                        flexDirection={'row'}
                >
                    <Box
                            flex={0.5}
                    >
                        <TextInput
                                required
                                noMargin
                                validate={required()}
                                label={'Nombre'}
                                source={'name'}
                        />
                    </Box>

                    <Box>
                        <SlugInputController />
                    </Box>

                    <Box flex={0.5}>
                        <SelectInput
                                required
                                disabled={!!id}
                                validate={required()}
                                source={'type'}
                                label={'Tipo'}
                                noMargin
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


                <Box

                >
                    <PhoneTextInput
                            label={'Teléfono'}
                            source={'contactPhone'}
                    />
                </Box>


                <TextInput
                        multiline
                        label={'Descripción'}
                        source={'description'}
                />

                <Box>
                    <Section title={'Disponibilidad'} />

                    <CheckboxInput
                            source={'available'}
                            title={''}
                            required
                            label={'Habilitado'}
                    />

                </Box>

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
                                label={'Ubicación (Plaza)'}
                                source={'address'}
                        />
                    </Box>
                </Box>

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

            </>
    );
}

function SlugInputController() {
    const { watch, setValue } = useForm();
    const { filter } = useRestaurantSlugFilter();
    const values = watch(['name']);

    useEffect(() => {
        setValue('slug', filter(values.name));
    }, [values.name]);

    return (
            <TextInput
                    required
                    noMargin
                    validate={required()}
                    filterText={filter}
                    label={'Slug'}
                    placeholder={'Ej. rest-1'}
                    helperText={'Código único del local'}
                    source={'slug'}
            />
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
                    type={values?.type}
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

                            const createdAt = new Date();
                            const id = props?.id ?? UuidUtils.persistenceUuid();

                            try {

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
                                    available: data.available ?? false,
                                    type: data.type
                                });

                                await repo.guardUniqueSlug(
                                        restaurant.slug,
                                        restaurant.id
                                );


                                await save(restaurant, {
                                    logoUrl: data.logoUrl,
                                    coverImageUrl: data.coverImageUrl
                                });

                            } catch (e) {
                                if (e.message === 'SLUG_ALREADY_EXISTS') {
                                    setError('slug', {
                                        message: 'Código de local ya existe'
                                    });
                                    return;
                                }

                                props?.onSave?.();

                                notify('Lo sentimos, ha ocurrido un error inseperado.', 'error');
                                return;
                            }


                            if (managerDto) {
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

                                    await saveManager(manager);

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
                                    return;

                                }

                            }


                            props?.onSave?.();
                            notify('Guardado exitosamente', 'success');

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
