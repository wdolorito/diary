import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'

import AuthContext from '../../context/auth_context'
import PostContext from '../../context/post_context'
import Avatar from '../../components/avatar'
import Empty from '../../components/empty'

export async function getServerSideProps(context) {
  const props = context.query
  const { titleHash } = props

  if(titleHash) {
    return { props }
  } else {
    return { notFound: true }
  }
}

export default function Post(props) {
  const { titleHash } = props
  const { callPost, post, postReady } = useContext(PostContext)
  const { logged } = useContext(AuthContext)

  useEffect(() => {
    callPost('get', {}, titleHash)
  },[])

  if(postReady) {
    const { title,
            summary,
            body,
            createdAt,
            updatedAt } = post[1]
    const dispCreatedAt = new Date(createdAt).toUTCString()
    const dispUpdatedAt = new Date(updatedAt).toUTCString()

    const { avatar,
            firstName,
            middleName,
            lastName,
            handle } = post[0]

    return (
      <>
        <Head>
          <title>{ title }</title>
        </Head>
  
        <h2 >{ title }</h2>

        <blockquote><h6><em>{ summary }</em></h6></blockquote>

        <div className='row align-items-center'>
            <div className='col col-1' />
            <div className='col col-6'>
              <h5>by { firstName } { middleName } { lastName }</h5>
            </div>
            <div className='col col-5'>
              <Avatar
                key={ handle }
                avatar={ avatar }
                handle={ handle }
              />
            </div>
        </div>

        <blockquote>
          <div className='row'>
            <div className='col col-2 text-right'>
              created:
            </div>
            <div className='col col-10'>
              { dispCreatedAt }
            </div>
          </div>
          { (updatedAt !== createdAt ) &&
            <div className='row'>
              <div className='col col-2 text-right'>
                updated:
              </div>
              <div className='col col-10'>
                { dispUpdatedAt }
              </div>
            </div>
          }
        </blockquote>

        <div className='row'>
          <div dangerouslySetInnerHTML={{ __html: body }} />
        </div>
      </>
    )
  }

  return (
    <Empty />
  )
}