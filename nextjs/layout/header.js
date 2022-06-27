import Link from 'next/link'

export default function Header() {
  return (
    <>
      <ul className='nav'>
        <li className='nav-item'>
          <Link href='/post/add' passHref><a className='nav-link active'>Active</a></Link>
        </li>
        <li className='nav-item'>
          <a className='nav-link' href='#'>Link</a>
        </li>
        <li className='nav-item'>
          <a className='nav-link' href='#'>Link</a>
        </li>
        <li className='nav-item'>
          <a className='nav-link disabled' href='#'>Disabled</a>
        </li>
      </ul>
    </>
  )
}
