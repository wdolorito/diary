import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

import AuthContext from '../../context/auth_context'
import StaticContext from '../../context/static_context'
import Submit from '../../components/submit'

const Editor = dynamic(() => import('../../components/editor'), { ssr: false })

export default function SectionAdd() {
  const { logged } = useContext(AuthContext)
  const { createSection } = useContext(StaticContext)
  const [ section, setSection ] = useState('')
  const [ body, setBody ] = useState('<p>Add section</p>')
  const router = useRouter()

  const handleInput = e => {
    const { id, value } = e.target

    if(id === 'section') setSection(value)
  }

  const submitHandler = e => {
    e.preventDefault()
    const payload = {}

    payload.section = section
    payload.body = body

    createSection(payload)
    router.push('/')
  }

  useEffect(() => {
    if(!logged) router.push('/')
  },[logged])

  return (
    <>
      <Head>
        <title>Add Section</title>
      </Head>

      <h4 className='text-center'>Add Section</h4>

      <div className='container'>
        <div className='row'>
          <div className='col col-2' />
          <div className='col col-8'>
            <form onSubmit={ submitHandler }>
              <div className='form-group'>
                <label htmlFor='section'>Section</label>
                <input type='text' className='form-control' id='section' value={ section } onChange={ handleInput } required />
              </div>
              <div className='form-group'>
                <small id='editor-help' className='form-text text-muted'>Be sure to add a heading.</small>
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