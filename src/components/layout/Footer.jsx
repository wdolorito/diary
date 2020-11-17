import { Component } from 'react'
import { Link } from 'react-router-dom'

class Footer extends Component {
  render() {
    return(
        <footer className='page-footer'>
          <div className='container'>
            <h5 className='white-text'>Quick Links</h5>
            <ul>
              <li><Link className='grey-text text-lighten-3' title='Home' to='/'>Home</Link></li>
              <li><Link className='grey-text text-lighten-3' title='About' to='about'>About</Link></li>
              <li><Link className='grey-text text-lighten-3' title='Latest Posts' to='latest'>Latest Posts</Link></li>
              <li><Link className='grey-text text-lighten-3' title='All Posts' to='posts'>All Posts</Link></li>
            </ul>
          </div>
          <div className='footer-copyright'>
            <div className='container'>
              <div className='center-align'>
                Favicon made by <a href="https://www.flaticon.com/authors/ddara" title="dDara">dDara</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
              </div>
              <div className='center-align'>
                Avatar icon made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
              </div>
            </div>
          </div>
        </footer>
    )
  }
}

export default Footer
