import { createContext, useContext, useState } from 'react'

import NetworkContext from './network_context'
import AuthContext from './auth_context'

const PostContext = createContext()

const PostProvider = props => {
  const { callAxios } = useContext(NetworkContext)
  const { doRefresh, getAuthorization } = useContext(AuthContext)

  const [ posts, setPosts ] = useState([])
  const [ post, setPost ] = useState({})
  const [ postReady, setPostReady ] = useState(false)
 
  const postLink = process.env.NEXT_PUBLIC_POSTLINK
  const postsLink = process.env.NEXT_PUBLIC_POSTSLINK

  const getPosts = () => {
    const params = {
      method: 'get',
      url: postsLink
    }

    const success = res => {
      if(res.status === 200) {
        setPosts(res.data)
      } else {
        setPosts([])
      }
    }

    const fail = err => {
      console.log('get posts error', postsLink, err)
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
    callPost('delete', {}, id)
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

    const success = res => {
      const { status } = res
      if(status === 200) {
        if(type === 'get') {
          setPost(res.data)
          setPostReady(true)
        } else {
          getPosts()
        }
      }
      if(status === 201) {
        getPosts()
      }
    }

    const fail = err => {
      console.log(type, 'post error', postLink, err)
      doRefresh()
    }

    callAxios(config, success, fail)
  }

  const value = {
    posts,
    post,
    postReady,
    setPostReady,
    getPosts,
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
