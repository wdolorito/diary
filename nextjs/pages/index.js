import Head from 'next/head'
import { useContext, useEffect } from 'react'

import PostContext from '../context/post_context'
import Empty from '../components/empty'
import Posts from '../components/posts'

export default function Home() {
  const { getPosts, posts } = useContext(PostContext)

  useEffect(() => {
    getPosts()
  },[])

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
