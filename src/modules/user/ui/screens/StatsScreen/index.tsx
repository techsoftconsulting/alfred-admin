import { Box } from '@main-components/Base/Box';
import AppLayout from '@main-components/Layout/AppLayout';
import Text from '@main-components/Typography/Text';
import React from 'react';
import { AxisOptions, Chart } from 'react-charts';
import ResizableBox from '@modules/user/ui/screens/StatsScreen/components/ResizableBox';
import ScrollView from '@main-components/Utilities/ScrollView';
import useDimensions from '@utils/hooks/useDimensions';
import { DRAWER_WIDTH } from '../../../../../../app/(authenticated)/(menu)/_layout';
import useGetStats from '@modules/user/application/use-get-stats';
import { palette } from '@shared/ui/theme/AppTheme';
import { Icon } from '@main-components/Base/Icon';
import useFindRestaurantMalls from '@modules/restaurants/application/malls/use-find-restaurant-malls';

export default function StatsScreen() {
    const { data, loading } = useGetStats('*');
    const { data: malls, loading: loadingMalls } = useFindRestaurantMalls();

    const mostSearchedRestaurants = {
        label: 'Restaurantes más buscados',
        data: data?.['most-searched-restaurants']?.map(el => {
            return {
                primary: el.data?.restaurant?.name ?? '-',
                secondary: parseInt(el.count) ?? 0
            };
        }) ?? []
    };

    const mostVisitedMalls = {
        label: 'Plazas más visitadas',
        data: data?.['most-visited-malls']?.map(el => {
            const mall = malls?.find(m => m.id == el.data.mallId);

            return {
                primary: mall?.name ?? '-',
                secondary: parseInt(el.count) ?? 0
            };
        }) ?? []
    };

    const mostVisitedRestaurants = {
        label: 'Restaurantes más visitados',
        data: data?.['most-visited-restaurants']?.map(el => {
            return {
                primary: el.data?.restaurant?.name ?? '-',
                secondary: parseInt(el.count) ?? 0
            };
        }) ?? []
    };

    const mostVisitedPromotions = {
        label: 'Promociones más vistas',
        data: data?.['most-visited-promotions']?.map(el => {
            return {
                primary: el.data?.promotion?.name ?? '-',
                secondary: parseInt(el.count) ?? 0
            };
        }) ?? []
    };

    const mostReservedRestaurants = {
        label: 'Restaurantes más reservados',
        data: data?.['most-reserved-restaurants']?.map(el => {
            return {
                primary: el.restaurant?.name ?? '-',
                secondary: parseInt(el.count) ?? 0
            };
        }) ?? []
    };

    return (
            <AppLayout
                    title={'Reportes'}
                    loading={loading || loadingMalls}
            >
                <Box
                        flex={1}
                        bg={'white'}
                >
                    <ScrollView>
                        <Section
                                title={'Restaurantes con más visitas (más clics)'}
                        >
                            <Box>
                                {
                                    mostVisitedRestaurants.data.length > 0 ? (
                                            <BarChar
                                                    data={[mostVisitedRestaurants]}
                                            />
                                    ) : <EmptyState />
                                }
                            </Box>
                        </Section>

                        <Section
                                title={'Restaurantes más buscados'}
                        >
                            <Box>
                                {
                                    mostSearchedRestaurants.data.length > 0 ? (
                                            <BarChar data={[mostSearchedRestaurants]} />
                                    ) : <EmptyState />
                                }
                            </Box>
                        </Section>
                        <Section
                                title={'Plazas más visitadas'}
                        >
                            <Box>
                                {
                                    mostVisitedMalls.data.length > 0 ? (
                                            <BarChar data={[mostVisitedMalls]} />
                                    ) : <EmptyState />
                                }
                            </Box>
                        </Section>

                        <Section
                                title={'Restaurantes con más reservaciones'}
                        >
                            <Box>
                                {
                                    mostReservedRestaurants.data.length > 0 ? (
                                            <BarChar data={[mostReservedRestaurants]} />
                                    ) : <EmptyState />
                                }
                            </Box>
                        </Section>
                        <Section
                                title={'Promociones más vistas'}
                        >
                            <Box>
                                {
                                    mostVisitedPromotions.data.length > 0 ? (
                                            <BarChar data={[mostVisitedPromotions]} />
                                    ) : <EmptyState />
                                }
                            </Box>
                        </Section>
                    </ScrollView>
                </Box>
            </AppLayout>
    );
}

function EmptyState() {
    return (
            <Box
                    minHeight={400}
                    justifyContent={'center'}
                    alignItems={'center'}
            >
                <Box
                        justifyContent={'center'}
                        alignItems={'center'}
                >
                    <Icon
                            name={'ios-stats-chart'}
                            type={'ionicon'}
                            color={'greyMedium'}
                            numberSize={80}
                    />
                    <Box mt={'m'}>
                        <Text color={'greyMain'}>Sin estadísticas</Text>
                    </Box>
                </Box>
            </Box>
    );
}

function Section({ title, children }: { title: string, children: any }) {
    return (
            <Box
                    marginVertical={'xl'}
            >
                <Box mb={'m'}>
                    <Text
                            bold
                            variant={'heading3'}
                    >{title}</Text>

                </Box>

                <Box>
                    {children}
                </Box>
            </Box>
    );
}


function BarChar({ data }: { data: any }) {

    const primaryAxis = React.useMemo<AxisOptions<typeof data[number]['data'][number]>>(
            () => ({
                getValue: (datum) => datum.primary
            }),
            []
    );

    const secondaryAxes = React.useMemo<AxisOptions<typeof data[number]['data'][number]>[]>(
            () => [
                {
                    getValue: (datum) => datum.secondary
                }
            ],
            []
    );
    const { width } = useDimensions();
    return (
            <>
                <ResizableBox
                        resizable={false}
                        width={width - DRAWER_WIDTH - 100}
                        height={400}
                        style={{
                            boxShadow: 'none'
                        }}
                >
                    <Chart
                            style={{
                                boxShadow: 'none'
                            }}
                            options={{
                                tooltip: false,
                                data,
                                primaryAxis,
                                secondaryAxes,
                                defaultColors: [palette.PURPLE]
                            }}
                    />
                </ResizableBox>
            </>
    );
}