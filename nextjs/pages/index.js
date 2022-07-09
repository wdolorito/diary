import Head from 'next/head'
import { useContext, useEffect } from 'react'

import PostContext from '../context/post_context'
import StaticContext from '../context/static_context'
import Empty from '../components/empty'
import Posts from '../components/posts'

export default function Home() {
  const { getPosts, posts } = useContext(PostContext)
  const { getSections, sections } = useContext(StaticContext)

  useEffect(() => {
    if(Object.keys(sections).length === 0) {
      getPosts()
      getSections()
    }
  },[sections])

  if(posts.length === 0) {
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

  return (
    <>
      <Head>
        <title>William Dolorito's Blog</title>
        <meta name="description" content="William Dolorito's musings" />
      </Head>

      <Posts data={ posts } />
    </>
  )
}
