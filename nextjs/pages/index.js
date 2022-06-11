import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Head>
        <title>William Dolorito's Blog</title>
        <meta name="description" content="William Dolorito's musings" />
      </Head>

      <h1>hello world!</h1>
      <Image
        src='https://picsum.photos/640/480'
        width='640'
        height='480'
      />
    </>
  )
}
