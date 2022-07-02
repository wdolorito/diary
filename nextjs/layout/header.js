import Link from 'next/link'
import Image from 'next/image'

import Navlinks from '../components/navlinks'

/*
palette colors:
ACA084
827A7D
330033
446290
121916
*/

export default function Header() {
  return (
    <nav className='navbar navbar-expand-md navbar-dark' style={{ backgroundColor: '#446290'}}>
      <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
        <span className='navbar-toggler-icon' />
      </button>
      <Link href='/' passHref>
        <a className='navbar-brand'>
          <Image
            src='/project-management.png'
            alt='logo'
            width={ 30 }
            height={ 30}            
          />
        </a>
      </Link>
      <div className='collapse navbar-collapse' id='navbarNav'>
        <Navlinks />
      </div>
    </nav>
  )
}
