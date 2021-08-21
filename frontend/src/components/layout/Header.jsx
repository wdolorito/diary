import { Component } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../logo.png'

class Header extends Component {
  render() {
    return(
      <nav>
        <div className='nav-wrapper'>
          <Link to='/' className='brand-logo' title='Home'><img alt='logo' src={ logo }/></Link>
          <ul id="nav-mobile" className='right hide-on-med-and-down'>
            <li><Link to='latest' title='Latest'>Latest Posts</Link></li>
            <li><Link to='about' title='About'>About</Link></li>
            { (this.props.logged ) && <li><Link to='#' onClick={ this.props.doLogout }>Logout</Link></li>}
          </ul>
        </div>
      </nav>
    )
  }
}

export default Header
