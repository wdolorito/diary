import { Component } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../logo.png'

class Header extends Component {
  componentDidUpdate() {
    if(window.$('.button-collapse').length > 0) {
      this.initNav()
    } else {
      setTimeout(this.initNav, 100)
    }
  }

  initNav = () => {
    window.$('.button-collapse').sideNav()
  }

  onClick = () => {
    this.props.doLogout()
    window.location = '/'
  }

  render() {
    return(
      <nav>
        <div className='nav-wrapper blue-grey lighten-1'>
          <Link to='/' className='brand-logo' title='Home'><img alt='logo' src={ logo }/></Link>
          <Link to='#' data-activates='nav-mobile' className='button-collapse'><i className='material-icons black-text'>menu</i></Link>
          <ul className='right hide-on-med-and-down'>
            <li><Link className='black-text' to='about' title='About'>About</Link></li>
            { (this.props.logged) && <li><Link className='black-text' to='editor' title='Add Post'>Add Post</Link></li> }
            { (this.props.logged) && <li><Link className='black-text' to='#' title='Logout' onClick={ this.onClick }>Logout</Link></li> }
          </ul>
          <ul id='nav-mobile' className='side-nav'>
            <li><Link to='/' title='Home'>Home</Link></li>
            <li><Link to='about' title='About'>About</Link></li>
            { (this.props.logged) && <li><Link to='editor' title='Add Post'>Add Post</Link></li> }
            { (this.props.logged) && <li><Link to='#' title='Logout' onClick={ this.onClick }>Logout</Link></li> }
          </ul>
        </div>
      </nav>
    )
  }
}

export default Header
