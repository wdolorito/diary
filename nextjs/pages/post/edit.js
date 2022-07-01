import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

import AuthContext from '../../context/auth_context'
import PostContext from '../../context/post_context'
const Editor = dynamic(() => import("../../components/editor"), { ssr: false })
import Submit from '../../components/submit'

export default function PostEdit() {
  const { logged } = useContext(AuthContext)
  const { callPost, post } = useContext(PostContext)
  const [ title, setTitle ] = useState(post[1].title)
  const [ summary, setSummary ] = useState(post[1].summary)
  const [ body, setBody ] = useState(post[1].body)
  const router = useRouter()

  const handleInput = e => {
    const { id, value } = e.target

    if(id === 'summary') setSummary(value)
    if(id === 'title') setTitle(value)
  }

  const submitHandler = e => {
    e.preventDefault()
    const payload = {}

    payload.title = title
    payload.body = body
    if(summary) {
      payload.summary = summary
    } else {
      payload.summary = body.replace(/<[^>]+>/g, '')
    }
    callPost('put', payload, post[1]._id)
    router.push('/')
  }

  useEffect(() => {
    if(!logged) router.push('/')
  },[logged])

  return (
    <>
      <Head>
        <title>Edit Post</title>
      </Head>

      <h4 className='text-center'>Edit Post</h4>

      <div className='container'>
        <div className='row'>
          <div className='col col-2' />
          <div className='col col-8'>
            <form onSubmit={ submitHandler }>
              <div className='form-group'>
                <label htmlFor='title'>Title</label>
                <input type='text' className='form-control' id='title' value={ title } onChange={ handleInput } required />
              </div>
              <div className='form-group'>
                <label htmlFor='summary'>Summary</label>
                <input type='text' className='form-control' id='summary' value={ summary } onChange={ handleInput } />
              </div>
              <div className='form-group'>
                <Editor data={ body } setData={ setBody }/>
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