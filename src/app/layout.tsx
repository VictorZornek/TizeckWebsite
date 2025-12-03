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
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              background-color: #FFFFFF;
              margin: 0;
              padding: 0;
            }
          `
        }} />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}