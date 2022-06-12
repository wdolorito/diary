import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>

      <Head>
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css' type='text/css' />
        <link rel='icon' type='image/png' href='/project-management.png' />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>

    </Html>
  )
}
