import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    COLORS: {
      BLACK_900: string
      WHITE_900: string
      GRAY_900: string
      GRAY_700: string
      GRAY_500: string
      GRAY_300: string
    }
    FONTS_WEIGHT: {
      REGULAR: number
      MEDIUM: number
      SEMI_BOLD: number
      BOLD: number
    }
  }
}
