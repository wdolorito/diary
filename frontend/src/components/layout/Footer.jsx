import { Component } from 'react'
import { Link } from 'react-router-dom'

class Footer extends Component {
  render() {
    return(
        <footer className='page-footer blue-grey lighten-1'>
          <div className='container'>
            <h5 className='black-text'>Quick Links</h5>
            <ul>
              <li><Link className='black-text' title='Home' to='/'>Home</Link></li>
              <li><Link className='black-text' title='About' to='about'>About</Link></li>
            </ul>
          </div>
          <div className='footer-copyright'>
            <div className='container black-text'>
              <div className='center-align'>
                Favicon by <a href="https://www.flaticon.com/authors/ddara" title="dDara">dDara</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
              </div>
              <div className='center-align'>
                Avatar icon by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
              </div>
            </div>
          </div>
        </footer>
    )
  }
}

export default Footer
