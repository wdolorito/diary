import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Head>
        <title>404</title>
        <meta name="description" content="404 page" />
      </Head>

      <h1 className='text-center'>This section does not exist.</h1>
      <div className='text-center'>
        <Image
          src='https://picsum.photos/640/480'
          alt='Some random image'
          width='640'
          height='480'
        />
      </div>
    </>
  )
}
