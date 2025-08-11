import { ReactNode } from "react";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400','500','600'], 
  variable: '--font-inter'
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head></head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}