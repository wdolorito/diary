import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function ForOhFour() {
  const router = useRouter()
  const { asPath } = router
  const [ section, setSection ] = useState('')

  useEffect(() => {
    setSection(asPath)
  },[])

  return (
    <>
      <Head>
        <title>404</title>
        <meta name='description' content='404 page' />
      </Head>

      <h1 className='text-center'>{section} does not exist.</h1>
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
