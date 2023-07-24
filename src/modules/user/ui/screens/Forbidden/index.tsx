import { Box } from '@main-components/Base/Box';
import { Icon } from '@main-components/Base/Icon';
import Text from '@main-components/Typography/Text';

export default function Forbidden() {
    return (
        <Box
            bg='white'
            flex={1}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <Icon
                name={'block'}
                type={'entypo'}
                numberSize={100}
                color={'greyMain'}
            />
            <Box mt={'m'}>
                <Text
                    color={'greyMain'}
                    variant={'heading2'}
                >Acceso restringido.</Text>
            </Box>
        </Box>
    );
}