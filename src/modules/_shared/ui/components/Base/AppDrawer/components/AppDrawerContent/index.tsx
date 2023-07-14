import { Box } from '@main-components/Base/Box';
import { Image } from '@main-components/Base/Image';
import useLogout from '@modules/auth/application/use-logout';
import images from '@modules/_shared/ui/images/images';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import React from 'react';
import DrawerContentContainer from './components/DrawerContentContainer/index.web';
import DrawerItem from './components/DrawerItem';
import MenuItemsList from './components/MenuItemsList/index.web';
import AppIcon from '@main-components/Base/AppIcon';
import { useTheme } from '@shared/ui/theme/AppTheme';
import { FOOTER_HEIGHT } from '../../../../../../../../../app/(authenticated)/(menu)/_layout';

export default function AppDrawerContent(props: DrawerContentComponentProps & { loading?: boolean; collapsed?: boolean }) {
    const { logout } = useLogout();
    const theme = useTheme();

    return (
            <DrawerContentContainer
                    scrollbar={{
                        color: 'rgba(0,0,0,0.4)',
                        hoverColor: 'rgba(0,0,0,0.6)'
                    }}
            >

                <Box
                        justifyContent={'center'}
                        alignItems={'center'}
                        p='s'
                        bg={'primaryMain'}
                >
                    {
                        props.collapsed ? (
                                <Box />
                        ) : (
                                <Image
                                        source={images.LOGO}
                                        style={{
                                            width: 100,
                                            height: 80,
                                            resizeMode: 'contain'
                                        }}
                                />
                        )
                    }

                </Box>


                <Box
                        flex={1}
                        pt={'m'}
                >
                    <MenuItemsList {...props} />
                </Box>

                <Division />

                <Box
                        style={{
                            paddingBottom: FOOTER_HEIGHT + 10
                        }}
                >
                    <DrawerItem
                            key={'logout'}
                            icon={(props) => (
                                    <AppIcon
                                            color={props.color ?? 'white'}
                                            size={20}
                                            name='log-out'
                                    />
                            )}
                            label='Cerrar sesión'
                            onPress={async () => {
                                await logout();
                            }}
                    />
                </Box>

            </DrawerContentContainer>
    );
}

function Division() {
    return (
            <Box
                    mb='s'
                    borderBottomWidth={1.5}
            />
    );
}
