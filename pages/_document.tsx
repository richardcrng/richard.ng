import { AppInitialProps } from "next/app";
import Document, { DocumentContext } from "next/document";
import { CssBaseline } from "@geist-ui/react";
import { ServerStyleSheet } from "styled-components";

/**
 * Geist UI: https://react.geist-ui.dev/en-us/guide/server-render
 */

/**
 * Styled Components: https://styled-components.com/docs/advanced#server-side-rendering
 */

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: AppInitialProps) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      const styles = CssBaseline.flush();
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}
