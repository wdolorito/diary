import { Component } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../logo.png'

class Header extends Component {
  render() {
    return(
      <nav>
        <div className='nav-wrapper'>
          <Link to='/' className='brand-logo' title='Home'><img src={ logo }/></Link>
          <ul id="nav-mobile" className='right hide-on-med-and-down'>
            <li><Link to='latest' title='Latest'>Latest Posts</Link></li>
            <li><Link to='posts' title='All Posts'>All Posts</Link></li>
            <li><Link to='about' title='About'>About</Link></li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default Header
