import Link from 'next/link'
import { useContext, useEffect } from 'react'
import AuthContext from '../context/auth_context'
import PostContext from '../context/post_context'

export default function Navlinks() {
  const { logged } = useContext(AuthContext)
  const { statics } = useContext(PostContext)

  if(logged) {
    return (
      <ul className='nav'>
        <li className='nav-item'>
          <Link href='/' passHref><a className='nav-link'>Home</a></Link>
        </li>
        <li className='nav-item'>
          <Link href='/post/add' passHref><a className='nav-link'>Add Post</a></Link>
        </li>
        <li className='nav-item'>
          <Link href='/section/add' passHref><a className='nav-link'>Add Section</a></Link>
        </li>
      </ul>
    )
  
  }

  return (
    <ul className='nav'>
      <li className='nav-item'>
        <Link href='/' passHref><a className='nav-link'>Home</a></Link>
      </li>
    { 
      statics.map((item, index) => {
        return (
          <li className='nav-item' key={ index }>
            <Link href={ '/' + item.section } passHref><a className='nav-link'>{ item.section }</a></Link>
          </li>
        )
      })
    }
  </ul>
  )
}
