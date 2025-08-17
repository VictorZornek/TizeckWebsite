import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    COLORS: {
      BLACK_900: string
      BLACK_700: string
      WHITE_900: string
      WHITE_600: string
      GRAY_700: string
      GRAY_500: string
      GRAY_400: string
      GRAY_300: string
      BLUE: string
      DARK_BLUE: string
      GREEN: string
    }

    FONTS_WEIGHT: {
      REGULAR: number
      MEDIUM: number
      SEMI_BOLD: number
      BOLD: number
    }

    BREAKPOINTS: {
      xs: number
      sm: number
      md: number
      lg: number
      xl: number
      xxl: number
    }
  }
}
