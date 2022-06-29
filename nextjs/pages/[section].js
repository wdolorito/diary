import Head from 'next/head'
import { useContext } from 'react'

import AuthContext from '../context/auth_context'
import Delete from '../components/delete'
import Edit from '../components/edit'

export async function getServerSideProps(context) {
  const { section } = context.query
  const res = await fetch(process.env.NEXT_PUBLIC_POSTLINK + '/static/' + section)
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
    props: { title, body }
  }
}

export default function Section(props) {
  const { title, body } = props
  const { logged } = useContext(AuthContext)

  const btnAction = (e) => {
    e.preventDefault()

    const { name } = e.target
    console.log(name)
  }
                      
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>

      <div className='row mt-5'>
        <div className='col'>
          <div dangerouslySetInnerHTML={{ __html: body }} />
        </div>
      </div>

      { logged &&
        <div className='row'>
          <div className='col text-center'>
            <Delete action={ btnAction } name='section' />
          </div>
          <div className='col text-center'>
            <Edit action={ btnAction } name='section'/>
          </div>
        </div>
      }
    </>
  )
}
