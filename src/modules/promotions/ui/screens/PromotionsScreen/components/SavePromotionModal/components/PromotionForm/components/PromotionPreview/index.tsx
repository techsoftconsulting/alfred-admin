import { useForm } from '@shared/domain/form/useForm';
import useFindRestaurant from '@modules/restaurants/application/use-find-restaurant';
import { Box } from '@main-components/Base/Box';
import { Icon } from '@main-components/Base/Icon';
import Text from '@main-components/Typography/Text';
import { Image } from '@main-components/Base/Image';
import React from 'react';

export default function PromotionPreview() {
    const { watch } = useForm();
    const values = watch(['name', 'description', 'restaurantId', 'imageUrl']);
    const { data: restaurant, loading } = useFindRestaurant(values.restaurantId, {
        enabled: !!values.restaurantId
    });

    return (
            <Box
                    pt={'xl'}
                    borderTopWidth={1}
                    borderTopColor={'greyMedium'}
            >
                <PromoItem
                        item={{
                            name: values.name ?? '',
                            description: values.description ?? '',
                            imageUrl: values.imageUrl?.image ?? values?.imageUrl
                        }}
                        direction={'row'}
                        restaurant={restaurant}
                />

                <Box
                        justifyContent={'center'}
                        mt={'s'}
                        flexDirection={'row'}
                        alignItems={'center'}
                        gap={'s'}
                >
                    <Box>
                        <Icon
                                name={'info-circle'}
                                color={'greyMain'}
                                numberSize={16}
                        />
                    </Box>
                    <Box>
                        <Text color={'greyMain'}>Preview en la sección de promociones</Text>
                    </Box>

                </Box>
            </Box>
    );
}

function PromoItem({ item, restaurant, direction }) {

    return (
            <div>
                <Box
                        borderRadius={20}
                        bg={'greyLightest'}
                        marginHorizontal={'m'}
                >

                    <Box>

                        <Image
                                resizeMode={'cover'}
                                style={{
                                    borderRadius: 20,
                                    aspectRatio: 3 / 1
                                }}
                                source={{
                                    uri: item?.imageUrl
                                }}
                        />
                        <OverlayItem />
                        <Box
                                position={'absolute'}
                                height={'100%'}
                                width={'100%'}
                                flexDirection={direction}
                        >
                            <Box>
                                <Box
                                        width={'100%'}
                                        height={'100%'}
                                        style={{
                                            borderRadius: 20,
                                            aspectRatio: 1 / 1
                                        }}
                                >
                                    <Image
                                            resizeMode={'cover'}
                                            style={{
                                                borderRadius: 20,
                                                aspectRatio: 1 / 1
                                            }}
                                            source={{
                                                uri: restaurant?.logoUrl
                                            }}
                                    />
                                </Box>
                            </Box>
                            <Box
                                    flex={1}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                            >
                                <Text
                                        bold
                                        variant={'body1'}
                                        color={'white'}
                                >{item?.name}</Text>

                                <Box mt={'m'}>
                                    <Text
                                            variant={'medium'}
                                            color={'white'}
                                    >{item?.description} </Text>
                                </Box>
                            </Box>
                        </Box>

                    </Box>
                </Box>
            </div>
    );
}

function OverlayItem() {
    return (
            <Box
                    borderRadius={20}
                    position={'absolute'}
                    width={'100%'}
                    height={'100%'}
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}
            >

            </Box>
    );
}