import Head from 'next/head'

export async function getServerSideProps(context) {
  const { section } = context.query
  const res = await fetch(`http://localhost:3000/api/post/static/` + section)
  const response = await res
  if(response.status === 204) {
    return {
      redirect: {
        permanent: false,
        destination: `/404`
      }
    }
  }

  const data = await response.json()

  const { body } = data
  const title = data.section
  
  return {
    props: { title, body }
  }
}

export default function Section(props) {
  const { title, body } = props

  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>

      <div dangerouslySetInnerHTML={{__html: body }} />
    </>
  )
}
