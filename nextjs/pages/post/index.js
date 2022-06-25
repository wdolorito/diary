import Head from 'next/head'

export async function getServerSideProps(context) {
  const props = context.query

  if(props.length === undefined ) {
    return { notFound: true }
  } else {
    return { props }
  }
}

export default function Post(props) {
  const { post, author } = props

  return (
    <>
      <Head>
        <title>{ post.title }</title>
      </Head>

      <h1>{ post.body }</h1>
    </>
  )
}