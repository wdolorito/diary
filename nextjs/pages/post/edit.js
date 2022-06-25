import dynamic from 'next/dynamic'
import Head from 'next/head'

const Editor = dynamic(() => import("../../components/editor"), { ssr: false })

export default function PostEdit() {
  return (
    <>
      <Head>
        <title>Edit Post</title>
      </Head>

      <Editor data='Edit post' />
    </>
  )
}