import Head from 'next/head'
import Script from 'next/script'

export default function Layout({ children }) {
  return (
    <div className='container'>
      <Head>
        <meta charSet='UTF-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge,chrome=1' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <link rel='icon' type='image/png' href='/project-management.png' />
      </Head>

      <main>{ children }</main>

      <Script
        src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js'
        strategy='beforeInteractive'
      />
      <Script
        src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js'
        strategy='beforeInteractive'
      />
      <Script
        src='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/js/bootstrap.min.js'
        strategy='beforeInteractive'
      />
    </div>
  )
}
