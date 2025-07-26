// components/Providers.tsx
'use client';

import { ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "@/styles/global";
import theme from "@/styles/theme";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  )
}
