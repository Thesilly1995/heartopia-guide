import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * Root HTML-document voor de web-export (`npx expo export -p web`). Wordt
 * statisch gegenereerd — dit bestand bepaalt dus ook de SEO-tags die écht in
 * de geëxporteerde HTML terechtkomen. `<Head>` (expo-router/head,
 * react-helmet-async) update de `<head>` alleen client-side ná hydratie bij
 * `web.output: "static"` (geen server-side collectie zoals bij
 * `output: "server"`), en `generateMetadata()` is pas vanaf Expo SDK 58
 * beschikbaar — vandaar hier een vaste, site-brede titel/omschrijving i.p.v.
 * per-route metadata.
 */
export default function Root({ children }: PropsWithChildren) {
  const { headNodes, bodyNodes, htmlAttributes, bodyAttributes } = useServerDocumentContext();

  return (
    <html lang="nl" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <meta name="google-site-verification" content="2loaBGU7uG_raND40173g4hBs_dQLJNBI1i-gxDoaQ4" />

        <title>Heartopedia — gratis gids voor Heartopia</title>
        <meta
          name="description"
          content="Heartopedia is een gratis, onofficiële gids voor de game Heartopia: vissen, vogels, insecten, recepten, events, giftcodes en meer — altijd actueel."
        />
        <link rel="canonical" href="https://heartopia-guide-nine.vercel.app/" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Heartopedia" />
        <meta property="og:title" content="Heartopedia — gratis gids voor Heartopia" />
        <meta
          property="og:description"
          content="Een gratis, onofficiële gids voor de game Heartopia: vissen, vogels, insecten, recepten, events, giftcodes en meer — altijd actueel."
        />
        <meta property="og:url" content="https://heartopia-guide-nine.vercel.app/" />
        <meta name="twitter:card" content="summary" />

        <ScrollViewStyleReset />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
