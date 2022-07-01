import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

import AuthContext from '../../context/auth_context'
import PostContext from '../../context/post_context'
import Empty from '../../components/empty'
import Submit from '../../components/submit'

const Editor = dynamic(() => import("../../components/editor"), { ssr: false })

export async function getServerSideProps(context) {
  const { referer } = context.req.headers
  if(referer === undefined) {
      return  {
        redirect: {
          permanent: false,
          destination: `/`
        }
      } 
  }

  const words = referer.split('/')
  const section = words[words.length - 1]

  return {
    props: { section }
  }
}

export default function SectionEdit(props) {
  const { logged } = useContext(AuthContext)
  const { callPost, getStatic, page, pageReady, setPageReady } = useContext(PostContext)
  const { section } = props
  const [ body, setBody ] = useState('')
  const router = useRouter()

  const submitHandler = e => {
    e.preventDefault()
    const payload = {}

    payload.section = section
    payload.body = body

    callPost('put', payload, 'static/' + section)
    router.push('/' + section)
  }

  useEffect(() => {
    if(!logged) router.push('/')
    getStatic(section)
    return () => { setPageReady(false) }
  }, [logged])

  if(pageReady) {
    return (
      <>
        <Head>
          <title>Edit Section</title>
        </Head>
  
        <h4 className='text-center'>Edit Section</h4>
  
        <div className='container'>
          <div className='row'>
            <div className='col col-2' />
            <div className='col col-8'>
              <form onSubmit={ submitHandler }>
                <div className='form-group'>
                  <label htmlFor='section'>Section</label>
                  <input type='text' className='form-control' id='section' value={ section } disabled />
                </div>
                <div className='form-group'>
                  <small id='editor-help' className='form-text text-muted'>Don't forget the heading.</small>
                  <Editor data={ page.body } setData={ setBody } />
                </div>
                <Submit />
              </form>
            </div>
            <div className='col col-2' />
          </div>
        </div>
      </>
    )
  }

  return ( <Empty /> )
}
