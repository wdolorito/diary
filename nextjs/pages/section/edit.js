import dynamic from 'next/dynamic'
import Head from 'next/head'

const Editor = dynamic(() => import("../../components/editor"), { ssr: false })

export default function SectionEdit() {
  return (
    <>
      <Head>
        <title>Edit Section</title>
      </Head>

      <Editor data='Edit section' />
    </>
  )
}
