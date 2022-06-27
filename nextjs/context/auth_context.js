import { useRouter } from 'next/router'
import { createContext, useContext, useState } from 'react'

import NetworkContext from './network_context'

const AuthContext = createContext()

const AuthProvider = props => {
  const { callAxios } = useContext(NetworkContext)

  const refreshLink = process.env.NEXT_PUBLIC_REFRESHLINK
  const logoutLink = process.env.NEXT_PUBLIC_LOGOUTLINK
  const loginLink = process.env.NEXT_PUBLIC_LOGINLINK

  const router = useRouter()
  const [ jwt, setJwt ] = useState('')
  const [ logged, setLogged ] = useState(false)

  const resetJwt = () => {
    localStorage.removeItem('token')
    setLogged(false)
    setJwt('')
    router.push('/')
  }
  
  const getToken = () => {
    return localStorage.getItem('token')
  }
  
  const storeToken = token => {
    localStorage.setItem('token', token)
  }
  
  const getAuthorization = () => {
    const auth = { 'Authorization': 'Bearer ' + jwt }
    return auth
  }

  const doLogin = (email, password) => {
    const data = { email, password }
    const config = {
      method: 'post',
      url: loginLink,
      data: data
    }

    const success = res => {
      if(res.status === 200) {
        const { token, refresh } = res.data
        setJwt(token)
        setLogged(true)
        storeToken(refresh)
        router.push('/')
      }
    }

    const fail = err => {
      alert(email + ' is unable to log in.')
      resetJwt()
    }

    callAxios(config, success, fail)
  }
  
  const doRefresh = () => {
    const headers = getAuthorization()
    const refresh = getToken()
    if(refresh) {
      const data = { token: refresh }
      const config = {
        method: 'post',
        url: refreshLink,
        data: data,
        headers: headers
      }

      const success = res => {
        const { status } = res
        if(status === 200) {
          const { token, refresh } = res.data
          setJwt(token)
          setLogged(true)
          storeToken(refresh)
        }
      }

      const fail = err => {
        resetJwt()
      }

      callAxios(config, success, fail)
    }
  }
  
  const doLogout = () => {
    const headers = getAuthorization()
    const refresh = getToken()
    const config = {
      method: 'post',
      url: logoutLink,
      data: { refresh },
      headers: headers
    }

    const fn = res => {
      resetJwt()
    }

    callAxios(config, fn, fn)
  }

  const value = {
    logged,
    doLogin,
    doRefresh,
    doLogout,
    getAuthorization
  }

  return (
    <AuthContext.Provider value={ value }>
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthContext as default, AuthProvider }
