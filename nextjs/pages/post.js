export async function getServerSideProps(context) {
  const { props } = context.query

  if(props === undefined ) {
    return { notFound: true }
  } else {
    return { props }
  }
}

export default function Post(props) {
  const { post, author } = props

  return (
    <>
      <h1>{ post.title }</h1>
    </>
  )
}