import AppIcon from '@main-components/Base/AppIcon';
import { Box } from '@main-components/Base/Box';
import SaveButton from '@main-components/Form/components/SaveButton';
import { Form } from '@main-components/Form/Form';
import { BaseInput } from '@main-components/Form/inputs/BaseInput';
import CheckboxInput from '@main-components/Form/inputs/CheckboxInput';
import DateInput from '@main-components/Form/inputs/DateInput';
import TextInput from '@main-components/Form/inputs/TextInput';
import useSavePromotion from '@modules/promotions/application/use-save-promotion';
import Promotion from '@modules/promotions/domain/models/promotion';
import {
    PromotionImageInput
} from '@modules/promotions/ui/screens/PromotionsScreen/components/SavePromotionModal/components/PromotionForm/components/PromotionImageInput';
import MallsSelectInput from '@modules/restaurants/ui/components/MallsSelectInput';
import RestaurantSelectInput from '@modules/restaurants/ui/components/RestaurantSelectInput';
import { required } from '@shared/domain/form/validate';
import useNotify from '@shared/domain/hooks/use-notify';
import UuidUtils from '@utils/misc/uuid-utils';
import React, { useState } from 'react';
import useRepository from '@shared/domain/hooks/use-repository';
import RestaurantRepository from '@modules/restaurants/domain/repositories/restaurant-repository';

interface PromotionFormProps {
    id?: string;
    defaultValues?: any;
    onSave: any;
    item?: Promotion;
}

export default function PromotionForm(props: PromotionFormProps) {

    return (
            <Form
                    defaultValues={props.defaultValues}
                    toolbar={
                        <FormToolbar
                                item={props.item}
                                id={props.id}
                                onSave={props.onSave}
                        />
                    }
            >
                <Box flexDirection={'row'}>
                    <Box
                            flex={0.5}
                            mr={'l'}
                    >
                        <TextInput
                                required
                                validate={required()}
                                label={'Título'}
                                source={'name'}
                        />
                        <TextInput
                                multiline
                                required
                                validate={required()}
                                label={'Descripción'}
                                source={'description'}
                        />

                        <CheckboxInput
                                source={'available'}
                                title={'Disponible'}
                                required
                                label={'Disponible'}
                        />

                        <MallsSelectInput
                                required
                                validate={required()}
                                label={'Plazas'}
                                source={'mallsIds'}
                        />

                        <RestaurantSelectInput
                                required
                                validate={required()}
                                label={'Local'}
                                source={'restaurantId'}
                        />

                        <BaseInput
                                WrapperComponent={Box}
                                label={'Duración'}
                                bg={'white'}
                                required
                        >
                            <Box flexDirection={'row'}>
                                <Box
                                        mr={'m'}
                                        flex={0.5}
                                >
                                    <DateInput
                                            noMargin
                                            required
                                            helperText={'Inicio'}
                                            placeholder={'Horas'}
                                            validate={required()}
                                            source={'duration.start'}
                                    />
                                </Box>
                                <Box flex={0.5}>
                                    <DateInput
                                            noMargin
                                            required
                                            helperText={'Fin'}
                                            placeholder={'Horas'}
                                            validate={required()}
                                            source={'duration.end'}
                                    />
                                </Box>
                            </Box>
                        </BaseInput>
                    </Box>
                    <Box flex={0.5}>
                        <PromotionImageInput
                                label={'Imagen'}
                                helperText={'Aspecto 2:1. Min: 800px x 400px'}
                        />
                    </Box>
                </Box>
            </Form>
    );
}

function FormToolbar(props) {
    const { execute: save, loading } = useSavePromotion();
    const notify = useNotify();
    const storeRepo = useRepository<RestaurantRepository>('RestaurantRepository');
    const [saving, setSaving] = useState(false);

    return (
            <Box alignItems={'center'}>
                <SaveButton
                        {...props}
                        label='Guardar'
                        titleColor={'white'}
                        loading={loading || saving}
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
                            setSaving(true);

                            const storeId = data.restaurantId;

                            const store = await storeRepo.find(data.restaurantId);
                            if (!store) {
                                setSaving(false);
                                return;
                            }
                            const type = store.type;

                            if (!props.id) {
                                const promotion = Promotion.fromPrimitives({
                                    id: UuidUtils.persistenceUuid(),
                                    name: data.name,
                                    available: Boolean(data.available),
                                    duration: {
                                        start: data.duration.start,
                                        end: data.duration.end
                                    },
                                    mallsIds: data.mallsIds,
                                    description: data.description,
                                    imageUrl: '',
                                    createdAt: new Date(),
                                    status: 'ACTIVE',
                                    restaurantId: storeId?.trim(),
                                    type: type
                                });

                                await save(promotion, {
                                    imageUrl: data.imageUrl
                                });

                                setSaving(false);

                                props?.onSave?.();

                                notify('Promoción guardada exitosamente', 'success');
                                return;
                            }

                            if (!props.item) return;

                            const promotion: Promotion = props.item;

                            promotion.updateInfo({
                                description: data.description,
                                mallsIds: data.mallsIds,
                                duration: {
                                    start: data.duration.start,
                                    end: data.duration.end
                                },
                                available: Boolean(data.available),
                                name: data.name,
                                restaurantId: storeId?.trim(),
                                type: type
                            });

                            await save(promotion, {
                                imageUrl: data.imageUrl
                            });

                            setSaving(false);
                            props?.onSave?.();

                            notify('Promoción guardada exitosamente', 'success');
                        }}
                />
            </Box>
    );
}
