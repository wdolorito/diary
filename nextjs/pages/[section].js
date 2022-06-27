import Head from 'next/head'
import { useEffect } from 'react'

export async function getServerSideProps(context) {
  const { section } = context.query
  const res = await fetch(process.env.NEXT_PUBLIC_POSTLINK + '/static/' + section)
  const response = await res
  if(response.status !== 200) {
    return {
      notFound: true
    }
  }

  const data = await response.json()

  const { body } = data

  const sTitle = data.section
  const title = sTitle.toLowerCase()
                      .split(' ')
                      .map(word => {
                        return word[0].toUpperCase() + word.substr(1)
                      })
                      .join(' ')

  
  return {
    props: { title, body }
  }
}

export default function Section(props) {
  const { title, body } = props

  useEffect(() => {
    console.log('in catchall')
  },[])

  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>

      <div dangerouslySetInnerHTML={{__html: body }} />
    </>
  )
}
