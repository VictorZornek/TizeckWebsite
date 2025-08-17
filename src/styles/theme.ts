import { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  COLORS: {
    BLACK_900: "#000000",
    BLACK_700: "#1E1E1E",

    WHITE_900: "#FFFFFF",
    WHITE_600: "#EEEEEE",

    GRAY_700: "#788499",
    GRAY_500: "#7D7D7D",
    GRAY_400: "#4b5563",
    GRAY_300: "#D6D6D6",

    BLUE: "#1E43B1",
    DARK_BLUE: "#131B2A",

    GREEN: "#008000",
  },

  FONTS_WEIGHT: {
    REGULAR: 400,
    MEDIUM: 500,
    SEMI_BOLD: 600,
    BOLD: 800,
  },

  BREAKPOINTS: {
    xs: 320,
    sm: 375,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1440,
  },
} as const;

export default theme;