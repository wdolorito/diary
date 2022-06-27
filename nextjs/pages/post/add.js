import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

import AuthContext from '../../context/auth_context'
import PostContext from '../../context/post_context'
import Submit from '../../components/submit'

const Editor = dynamic(() => import("../../components/editor"), { ssr: false })

export default function PostAdd() {
  const { logged, getAuthorization } = useContext(AuthContext)
  const { callPost } = useContext(PostContext)
  const [ title, setTitle ] = useState('')
  const [ summary, setSummary ] = useState('')
  const [ body, setBody ] = useState('<p>Add post</p>')
  const router = useRouter()

  const handleInput = e => {
    const { id, value } = e.target

    if(id === 'summary') setSummary(value)
    if(id === 'title') setTitle(value)
  }

  const handleEditor = data => {
    setBody(data)
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
    callPost('post', payload)
  }

  useEffect(() => {
    if(!logged) console.log('need to verify for network calls')
  },[logged])

  return (
    <>
      <Head>
        <title>Add Post</title>
      </Head>

      <h4 className='text-center'>Add Post</h4>

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
                <Editor data={ body } getData={ handleEditor }/>
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