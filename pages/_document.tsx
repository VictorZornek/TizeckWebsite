import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {

    static async getInitialProps(ctx: DocumentContext) {
        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                enhanceApp: App => props =>
                    sheet.collectStyles(<App {...props} />),
                })

            const initialProps = await Document.getInitialProps(ctx)

            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            }

        } finally {
            sheet.seal()
        }
    }

    render() {
        return (
            <Html lang="pt-BR" style={{ backgroundColor: "#1E1E1E" }}>
                <Head>
                    {/* Meta para color-theme em mobile browsers */}
                    <meta name="theme-color" content="#1E1E1E" />

                    {/* Inline CSS para garantir background preto já no primeiro paint */}
                    <style
                        dangerouslySetInnerHTML={{
                            __html: `
                                /* garante fundo preto e texto branco em tudo, inclusive pseudo-elementos */
                                html, body, #__next {
                                    background-color: #1E1E1E !important;
                                }

                                /* tudo e seus pseudo-elementos */
                                *, *::before, *::after {
                                    background-color: #1E1E1E !important;
                                    border-color: #1E1E1E !important;
                                    box-shadow: none !important;
                                }

                                /* e qualquer container que o Next use como fallback */
                                [data-nextjs-loading], [data-nextjs-loading] * {
                                    background-color: #1E1E1E !important;
                                }

                                /* inputs, botões e links ficam transparentes para herdar o fundo */
                                button, input, textarea, select, a {
                                    background-color: transparent !important;
                                    color: inherit !important;
                                }

                                .preload‐btn, .preload‐btn * {
                                    background-color: transparent !important;
                                    color: inherit !important;
                                }
                            `,
                            }}
                    />
                </Head>
                <body style={{ backgroundColor: "#1E1E1E" }}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}