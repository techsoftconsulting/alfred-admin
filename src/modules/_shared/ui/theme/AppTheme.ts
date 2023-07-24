import { createBox, createText, createTheme, useTheme as useReTheme } from '@shopify/restyle';
import { Platform } from 'react-native';

export const palette = {
    BLACK: '#000',

    WHITE: '#FFFFFF',

    //BLUE
    DARKER_BLUE: '#2a3b56',
    DARK_BLUE: '#00378b',
    MEDIUM_BLUE: '#27579b',
    LIGHT_BLUE: '#D2DEF4',
    MAIN_BLUE: '#4979d0',

    TEXT: '#2D2D2D',

    //RED
    RED: '#dc3545',
    RED_LIGHTEST: '#fcdfe1',

    //GREY
    GREY: '#A3A3A3',
    GREY_MEDIUM: '#D9D9D9',
    GREY_LIGHT: '#EEEEEE',
    GREY_LIGHTEST: '#F6F6F6',
    GREY_SECONDARY: '#ebebeb',
    GREY_DARK: '#3C3C3C',

    TEXT_NOTE: '#9b9b9c',

    DARK_ORANGE: '#ea5f37',
    LIGHT_ORANGE: '#ea5f373d',
    ORANGE: '#ffc107',

    PURPLE: '#C127A9',
    PURPLE_LIGHT: '#9E2DDE',
    //GREEN
    GREEN: '#5cb85c',
    GREEN_LIGHT: '#95e4de',
    GREEN_DARK: '#00b278', //'#035a52',
    GREEN_LIGHTEST: '#d6f4f2',
    GREEN_CONTRAST: '#00ffad',

    LIGHT_YELLOW: '#fffbd3',

    INFO: '#27a9e0'
};

const theme = createTheme({
    colors: {
        primaryMain: palette.BLACK,
        primaryLightest: palette.LIGHT_BLUE,
        primaryLight: palette.LIGHT_BLUE,
        primaryDark: palette.BLACK,
        primaryDarker: palette.BLACK,
        primaryTextDark: palette.BLACK,
        primaryContrastText: palette.WHITE,
        primaryContrast: palette.GREEN_DARK,

        secondaryLight: palette.GREY_DARK,
        secondaryMain: palette.GREY_DARK,
        secondaryContrastText: palette.WHITE,

        warningMain: palette.ORANGE,
        warningLight: palette.LIGHT_ORANGE,
        warningLightest: palette.LIGHT_YELLOW,
        warningContrastText: palette.WHITE,

        infoMain: palette.INFO,
        infoContrastText: palette.WHITE,

        successMain: palette.GREEN,
        successContrastText: palette.WHITE,

        dangerMain: palette.RED,
        dangerContrastText: palette.WHITE,
        dangerLightest: palette.RED_LIGHTEST,


        contrastMain: palette.PURPLE,
        contrastLight: palette.PURPLE_LIGHT,

        white: palette.WHITE,
        black: palette.BLACK,

        textColor: palette.TEXT,
        textNoteColor: palette.TEXT_NOTE,
        headingText: palette.BLACK,
        textInputColor: palette.TEXT,
        inputLabelColor: palette.BLACK,
        inputPlaceholderColor: palette.GREY,

        greyDark: palette.GREY_DARK,
        greyMain: palette.GREY,
        greyLight: palette.GREY_LIGHT,
        greyMedium: palette.GREY_MEDIUM,
        greySecondary: palette.GREY_SECONDARY,
        greyLightest: palette.GREY_LIGHTEST
    },
    textVariants: {
        button: {
            color: 'primaryContrastText',
            fontSize: 16
            /*fontFamily: 'AppFont'*/
        },
        header: {
            fontSize: 34
            /*lineHeight: 42.5*/
            /*fontFamily: 'AppFont'*/
        },
        subheader: {
            /*lineHeight: 36*/
            /*fontFamily: 'AppFont'*/
        },
        body1: {
            color: 'textColor',
            fontSize: 16
            /*fontFamily: 'AppFont'*/
        },
        body: {
            color: 'textColor',
            fontSize: 16
            /*fontFamily: 'AppFont'*/
        },
        small: {
            color: 'textColor',
            fontSize: Platform.OS == 'web' ? 12 : 10
            /*fontFamily: 'AppFont'*/
        },
        medium: {
            color: 'textColor',
            fontSize: 12
            /*fontFamily: 'AppFont'*/
        },
        inputLabel: {
            color: 'inputLabelColor',
            fontSize: 14
            /*lineHeight: 14*/
            /*fontFamily: 'AppFont'*/
        },
        big1: {
            color: 'headingText',
            fontSize: 30
            /*fontFamily: 'AppFont',*/
            /*lineHeight: 30*/
        },
        heading1: {
            color: 'headingText',
            fontSize: 26
            /*fontFamily: 'AppFont',*/
            /*lineHeight: 26*/
        },
        heading2: {
            color: 'headingText',
            fontSize: 24
            /*fontFamily: 'AppFont',*/
            /*lineHeight: 24*/
        },
        heading3: {
            color: 'headingText',
            fontSize: 22
            /*lineHeight: 24*/
            /*fontFamily: 'AppFont'*/
        },
        heading4: {
            color: 'headingText',
            fontSize: 20
            /*lineHeight: 22*/
            /*fontFamily: 'AppFont'*/
        },
        navigationHeaderTitle: {
            fontSize: 22
            /*lineHeight: 22*/
            /*fontFamily: 'AppFont'*/
        }
    },
    iconSizes: {
        s: 20,
        m: 40,
        l: 60
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 40,
        xxl: 100
    },
    breakpoints: {
        phone: 0,
        tablet: 768,
        large: 992
    },
    borderRadius: {
        s: 8,
        m: 16,
        l: 24,
        xl: 40
    },
    buttonSizes: {
        s: 30,
        m: 50,
        l: 60
    }
});

export type Theme = typeof theme;
export const useTheme = () => useReTheme<Theme>();
export const BaseBox = createBox<Theme>();
export const BaseText = createText<Theme>();

export default theme;
