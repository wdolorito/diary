import Head from 'next/head'

import Empty from '../layout/empty'

export async function getServerSideProps(context) {
  const res = await fetch(`http://localhost:3000/api/posts`)
  const response = await res
  if(response.status === 204) {
    const data = {}
    return {
      props: { data }
    }
  }

  const data = await response.json()

  return {
    props: { data }
  }
}

export default function Home(props) {
  const { data } = props

  if(data.length === undefined) {
    return (
      <>
        <Head>
          <title>William Dolorito's Blog</title>
          <meta name="description" content="William Dolorito's musings" />
        </Head>

        <Empty />
      </>
    )
  }
}
