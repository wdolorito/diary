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
    if(logged) router.push('/')
  },[logged])

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>


      <h4 className='text-center'>Login here</h4>

      <div className='container'>
        <div className='row'>
          <div className='col-sm' />
          <div className='col-sm'>
            <form onSubmit={ submitHandler }>
              <div className='form-group'>
                <label htmlFor='exampleInputEmail1'>Email address</label>
                <input type='email' className='form-control' id='email' value={ email } onChange={ handleInput } required />
              </div>
              <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input type='password' className='form-control' id='password' value={ password } onChange={ handleInput } required />
              </div>
              <Submit />
            </form>
          </div>
          <div className='col-sm' />
        </div>
      </div>
    </>
  )
}
