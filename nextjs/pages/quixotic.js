import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

import AuthContext from '../context/auth_context'
import Submit from '../layout/submit'

export default function Home() {
  const { getToken,
          logged,
          doLogin,
          doRefresh } = useContext(AuthContext)

  const router = useRouter()
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const handleInput = e => {
    const id = e.target.id
    const value = e.target.value

    if(id === 'email') setEmail(value)
    if(id === 'password') setPassword(value)
  }

  const submitHandler = e => {
    e.preventDefault()
    doLogin(email, password)
  }

  useEffect(() => {
    const token = getToken()
    if(token != null && !logged) {
      doRefresh()
    }
    if(logged) {
      router.push('/employees')
    }
  },[logged])

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <h4 className='center-align'>Login to edit</h4>
      <div className='row'>
        <form className='col s12' onSubmit={ submitHandler }>
          <div className='row'>
            <div className='col s3'></div>
            <div className='input-field col s6'>
              <input
                id='email'
                type='email'
                className='validate'
                name='email'
                value={ email }
                onChange={ handleInput }
                required
              />
              <label htmlFor='email'>Email</label>
            </div>
            <div className='col s3'></div>
          </div>
          <div className='row'>
            <div className='col s3'></div>
            <div className='input-field col s6 '>
              <input
                id='password'
                type='password'
                className='validate'
                name='password'
                value={ password }
                onChange={ handleInput }
                required
              />
              <label htmlFor='password'>Password</label>
            </div>
            <div className='col s3'></div>
          </div>
          <div className='row'>
            <div className='col s3' />
            <div className='col s6'>
              <Submit />
            </div>
            <div className='col s3' />
          </div>
        </form>
      </div>
    </>
  )
}
