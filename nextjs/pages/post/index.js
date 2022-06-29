import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'

import AuthContext from '../../context/auth_context'
import PostContext from '../../context/post_context'
import Avatar from '../../components/avatar'
import Delete from '../../components/delete'
import Edit from '../../components/edit'
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
  const router = useRouter()

  const btnAction = (e) => {
    e.preventDefault()

    const { name } = e.target

    if(name === 'delete') router.push('/post/edit')
    if(name === 'edit') router.push('/post/edit')
  }

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
  
        <h2 className='text-center'>{ title }</h2>

        <p className='mt-3'><em>{ summary }</em></p>

        <div className='row align-items-center mt-5'>
          <div className='col col-1'>
            <Avatar
              key={ handle }
              avatar={ avatar }
              handle={ handle }
            />
          </div>
          <div className='col'>
            <h5>by { firstName } { middleName } { lastName }</h5>
          </div>
        </div>

        <div className='row mt-4'>
          <div className='col col-1 text-right'>
            <strong><em>created:</em></strong>
          </div>
          <div className='col col-11'>
            <strong>{ dispCreatedAt }</strong>
          </div>
        </div>
        { (updatedAt !== createdAt ) &&
          <div className='row'>
            <div className='col col-1 text-right'>
              <strong><em>updated:</em></strong>
            </div>
            <div className='col col-11'>
              <strong>{ dispUpdatedAt }</strong>
            </div>
          </div>
        }

        <div className='row mt-5'>
          <div className='col'>
            <div dangerouslySetInnerHTML={{ __html: body }} />
          </div>
        </div>

        { logged &&
          <div className='row'>
            <div className='col text-center'>
              <Delete action={ btnAction } name='post' />
            </div>
            <div className='col text-center'>
              <Edit action={ btnAction } name='post'/>
            </div>
          </div>
        }
      </>
    )
  }

  return (
    <Empty />
  )
}