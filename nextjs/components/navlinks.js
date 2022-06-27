import Link from 'next/link'
import { useContext } from 'react'
import AuthContext from '../context/auth_context'

export default function Navlinks() {
  const { logged } = useContext(AuthContext)

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
        <li className='nav-item'>
          <Link href='/about' passHref><a className='nav-link'>About</a></Link>
        </li>
      </ul>
    )
  
  }

  return (
    <ul className='nav'>
      <li className='nav-item'>
        <Link href='/' passHref><a className='nav-link'>Home</a></Link>
      </li>
      <li className='nav-item'>
        <Link href='/about' passHref><a className='nav-link'>About</a></Link>
      </li>
    </ul>
  )
}
