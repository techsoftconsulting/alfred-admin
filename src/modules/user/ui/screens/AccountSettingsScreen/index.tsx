import { Box } from '@main-components/Base/Box';
import AppLayout from '@main-components/Layout/AppLayout';
import ScrollView from '@main-components/Utilities/ScrollView';
import React from 'react';
import ChangePasswordForm from '@modules/user/ui/components/ChangePasswordForm';
import { Card, CardContent, CardTitle } from '@main-components/Base/Card';


export default function AccountSettingsScreen() {
    return (
            <AppLayout
                    title={'Ajustes de Cuenta'}
                    loading={false}
                    noPadding
            >
                <Box
                        flex={1}
                        pl={'m'}
                        mb={'m'}
                        bg={'white'}
                        pt={'m'}
                >
                    <ScrollView>
                        <Box flexDirection={'row'}>
                            <Box
                                    width={'100%'}
                                    maxWidth={500}
                            >
                                <Card>
                                    <CardTitle title={'Cambiar clave'} />
                                    <CardContent>
                                        <ChangePasswordForm />
                                    </CardContent>

                                </Card>
                            </Box>
                        </Box>

                    </ScrollView>
                </Box>
            </AppLayout>
    );
}
