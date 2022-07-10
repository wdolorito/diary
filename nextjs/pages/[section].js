import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext } from 'react'

import AuthContext from '../context/auth_context'
import StaticContext from '../context/static_context'
import Delete from '../components/delete'
import Edit from '../components/edit'

export async function getServerSideProps(context) {
  const { section } = context.query
  const res = await fetch(process.env.NEXT_PUBLIC_STATICLINK + '/' + section)
  const response = await res
  if(response.status !== 200) {
    return {
      notFound: true
    }
  }

  const data = await response.json()

  const { body } = data

  const sTitle = data.section
  const title = sTitle.toLowerCase()
                      .split(' ')
                      .map(word => {
                        return word[0].toUpperCase() + word.substr(1)
                      })
                      .join(' ')

  return {
    props: { section, title, body }
  }
}

export default function Section(props) {
  const { section, title, body } = props
  const { logged } = useContext(AuthContext)
  const { deleteSection } = useContext(StaticContext)
  const router = useRouter()

  const btnAction = (e) => {
    e.preventDefault()

    const { name } = e.target
    if(name === 'delete') {
      deleteSection(section)
      router.push('/')
    }
    if(name === 'edit') router.push('/section/edit')
  }
                      
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>

      <div className='container'>
        <div className='row mt-5'>
          <div className='col'>
            <div dangerouslySetInnerHTML={{ __html: body }} />
          </div>
        </div>

        { logged &&
          <div className='row mb-3'>
            <div className='col text-center'>
              <Delete action={ btnAction } name='section' />
            </div>
            <div className='col text-center'>
              <Edit action={ btnAction } name='section'/>
            </div>
          </div>
        }
      </div>
    </>
  )
}
