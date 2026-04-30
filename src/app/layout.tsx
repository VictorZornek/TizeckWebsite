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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light' || theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            html[data-theme="dark"],
            html[data-theme="dark"] body {
              background-color: #1a202c;
              color-scheme: dark;
            }

            html[data-theme="light"],
            html[data-theme="light"] body {
              background-color: #FFFFFF;
              color-scheme: light;
            }

            html:not([data-theme]),
            html:not([data-theme]) body {
              background-color: #1a202c;
              color-scheme: dark;
            }

            html, body {
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