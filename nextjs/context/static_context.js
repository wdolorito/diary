import { createContext, useContext, useState } from 'react'

import NetworkContext from './network_context'
import AuthContext from './auth_context'

const StaticContext = createContext()

const StaticProvider = props => {
  const { callAxios } = useContext(NetworkContext)
  const { doRefresh, getAuthorization } = useContext(AuthContext)

  const [ sections, setSections ] = useState([])
  const [ page, setPage ] = useState({})
  const [ pageReady, setPageReady ] = useState(false)
 
  const staticLink = process.env.NEXT_PUBLIC_STATICLINK
  const staticsLink = process.env.NEXT_PUBLIC_STATICSLINK

  const getSections = () => {
    const params = {
      method: 'get',
      url: staticsLink
    }

    const success = res => {
      if(res.status === 200) {
        setSections(res.data)
      }
    }

    const fail = err => {
      console.log('get statics error', staticsLink, err)
      doRefresh()
    }

    callAxios(params, success, fail)
  }

  const createSection = payload => {
    const headers = getAuthorization()

    const params = {
      method: 'post',
      url: staticLink,
      data: payload,
      headers: headers
    }

    const success = res => {
      const { status } = res
      if(status === 201) {
        getSections()
      }
    }

    const fail = err => {
      console.log('post static error', err)
      doRefresh()
    }

    callAxios(params, success, fail)
  }

  const getSection = section => {
    const params = {
      method: 'get',
      url: staticLink + '/' + section,
    }

    const success = res => {
      if(res.status === 200) {
        setPage(res.data)
        setPageReady(true)
      }
    }

    const fail = err => {
      console.log('get static error', err)
      doRefresh()
    }

    callAxios(params, success, fail)
  }

  const updateSection = (payload, section) => {
    const headers = getAuthorization()

    const params = {
      method: 'put',
      url: staticLink + '/' + section,
      data: payload,
      headers: headers
    }

    const success = res => {
      const { status } = res
      if(status === 200) {
        setPageReady(false)
        getSection(section)
      }
    }

    const fail = err => {
      console.log('put static error', err)
      doRefresh()
    }

    callAxios(params, success, fail)
  }

  const deleteSection = section => {
    const headers = getAuthorization()

    const params = {
      method: 'delete',
      url: staticLink + '/' + section,
      headers: headers
    }

    const success = res => {
      const { status } = res
      if(status === 200) {
        getSections()
      }
    }

    const fail = err => {
      console.log('delete static error', err)
      doRefresh()
    }

    callAxios(params, success, fail)
  }

  const value = {
    sections,
    page,
    pageReady,
    setPageReady,
    getSections,
    createSection,
    getSection,
    updateSection,
    deleteSection
  }

  return (
    <StaticContext.Provider value={ value }>
      {props.children}
    </StaticContext.Provider>
  )
}

export { StaticContext as default, StaticProvider }
