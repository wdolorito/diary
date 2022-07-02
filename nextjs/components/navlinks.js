import Link from 'next/link'
import { useContext } from 'react'
import AuthContext from '../context/auth_context'
import PostContext from '../context/post_context'

export default function Navlinks() {
  const { logged } = useContext(AuthContext)
  const { statics } = useContext(PostContext)

  const nicify = section => {
    return section.toLowerCase()
                  .split(' ')
                  .map(word => {
                    return word[0].toUpperCase() + word.substr(1)
                  })
                  .join(' ')
  }

  return (
    <ul className='navbar-nav'>
      { logged &&
        <li className='nav-item'>
          <Link href='/post/add' passHref><a className='nav-link'>Add Post</a></Link>
        </li>
      }
      { logged &&
        <li className='nav-item'>
            <Link href='/section/add' passHref><a className='nav-link'>Add Section</a></Link>
        </li>
      }
      {
        statics.map((item, index) => {
          const { section } = item
          return (
            <li className='nav-item' key={ index }>
              <Link href={ '/' + section } passHref>
                <a className='nav-link'>{ nicify(section) }</a>
              </Link>
            </li>
          )
        })
      }
    </ul>
  )
}
