import dynamic from 'next/dynamic'
import Head from 'next/head'

const Editor = dynamic(() => import("../../components/editor"), { ssr: false })

export default function SectionAdd() {
  return (
    <>
      <Head>
        <title>Add Section</title>
      </Head>

      <Editor data='Add section' />
    </>
  )
}
