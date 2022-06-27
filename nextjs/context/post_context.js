import { useRouter } from 'next/router'
import { createContext, useContext, useState } from 'react'

import NetworkContext from './network_context'
import AuthContext from './auth_context'

const PostContext = createContext()

const PostProvider = props => {
  const { callAxios } = useContext(NetworkContext)
  const { getAuthorization } = useContext(AuthContext)
  const router = useRouter()

  const [ posts, setPosts ] = useState([])
  const [ post, setPost ] = useState({})
  const [ postReady, setPostReady ] = useState(false)
 
  const postLink = process.env.NEXT_PUBLIC_POSTLINK
  const postsLink = process.env.NEXT_PUBLIC_POSTSLINK

  const getPosts = () => {
    const params = {
      method: 'get',
      url: postsLink,
    }

    const success = (res) => {
      if(res.status === 200) {
        setPosts(res.data)
      }
    }

    const fail = (err) => {
      console.log('get posts error', postsLink, err)
    }

    callAxios(params, success, fail)
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
      if(res.status === 200) {
        if(type === 'get') {
          setPost(res.data)
          setPostReady(true)
        }
        if(type === 'put' || type === 'post' || type === 'delete') getPosts()
        if(type === 'delete') router.push('/')
      }
    }

    const fail = (err) => {
      console.log(err)
    }

    callAxios(config, success, fail)
  }

  const value = {
    posts,
    post,
    postReady,
    setPostReady,
    getPosts,
    callPost
  }

  return (
    <PostContext.Provider value={ value }>
      {props.children}
    </PostContext.Provider>
  )
}

export { PostContext as default, PostProvider }
