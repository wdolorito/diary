import dynamic from 'next/dynamic'
import Head from 'next/head'

const Editor = dynamic(() => import("../../components/editor"), { ssr: false })

export default function PostAdd() {
  return (
    <>
      <Head>
        <title>Add Post</title>
      </Head>

      <Editor data='Add post' />
    </>
  )
}