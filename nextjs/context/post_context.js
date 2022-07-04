import { useRouter } from 'next/router'
import { createContext, useContext, useState } from 'react'

import NetworkContext from './network_context'
import AuthContext from './auth_context'

const PostContext = createContext()

const PostProvider = props => {
  const { callAxios } = useContext(NetworkContext)
  const { doRefresh, getAuthorization } = useContext(AuthContext)
  const router = useRouter()

  const [ posts, setPosts ] = useState([])
  const [ statics, setStatics ] = useState([])
  const [ page, setPage ] = useState({})
  const [ pageReady, setPageReady ] = useState(false)
  const [ post, setPost ] = useState({})
  const [ postReady, setPostReady ] = useState(false)
 
  const postLink = process.env.NEXT_PUBLIC_POSTLINK
  const postsLink = process.env.NEXT_PUBLIC_POSTSLINK
  const staticsLink = process.env.NEXT_PUBLIC_STATICSLINK

  const getPosts = () => {
    const params = {
      method: 'get',
      url: postsLink
    }

    const success = (res) => {
      if(res.status === 200) {
        setPosts(res.data)
      }
    }

    const fail = (err) => {
      console.log('get posts error', postsLink, err)
      doRefresh()
    }

    callAxios(params, success, fail)
  }

  const getStatics = () => {
    const params = {
      method: 'get',
      url: staticsLink
    }

    const success = (res) => {
      if(res.status === 200) {
        setStatics(res.data)
      }
    }

    const fail = (err) => {
      console.log('get statics error', staticsLink, err)
      doRefresh()
    }

    callAxios(params, success, fail)
  }

  const getStatic = section => {
    const params = {
      method: 'get',
      url: postLink + '/static/' + section
    }

    const success = (res) => {
      if(res.status === 200) {
        setPage(res.data)
        setPageReady(true)
      }
    }

    const fail = (err) => {
      console.log('get static error', err)
      doRefresh()
    }

    callAxios(params, success, fail)
  }

  const createPost = payload => {
    callPost('post', payload)
  }

  const getPost = titleHash => {
    callPost('get', {}, titleHash)
  }

  const updatePost = (payload, id) => {
    callPost('put', payload, id)
  }

  const deletePost = id => {
    /* fix me */
  }

  const callPost = (type, payload, id) => {
    let link = postLink
    if(id) link += '/' + id
    let headers = {}
    if(type !== 'get') headers = getAuthorization()
    const config = {
      method: type,
      url: link,
      data: payload,
      headers: headers
    }

    const success = (res) => {
      const { status } = res
      if(status === 200) {
        if(type === 'get') {
          setPost(res.data)
          setPostReady(true)
        }
        if(type === 'put' || type === 'delete') getPosts()
        if(type === 'delete') router.push('/')
      }
      if(status === 201) {
        getPosts()
        getStatics()
      }
    }

    const fail = (err) => {
      doRefresh()
    }

    callAxios(config, success, fail)
  }

  const value = {
    posts,
    statics,
    page,
    pageReady,
    post,
    postReady,
    setPageReady,
    setPostReady,
    getPosts,
    getStatics,
    getStatic,
    createPost,
    getPost,
    updatePost,
    deletePost
  }

  return (
    <PostContext.Provider value={ value }>
      {props.children}
    </PostContext.Provider>
  )
}

export { PostContext as default, PostProvider }
