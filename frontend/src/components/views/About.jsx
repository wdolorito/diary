import { Component } from 'react'
import { Link } from 'react-router-dom'

class About extends Component {
  componentDidMount() {
    const time = new Date().getTime()
    console.log('about mounted ' + time)
    if(!this.props.aboutReceived) {
      console.log('getting about')
      this.props.callPost('get', null, 'static?about')
    }
  }

  componentDidUpdate() {
    const time = new Date().getTime()
    console.log('about updated ' + time)
  }

  componentWillUnmount() {
    const time = new Date().getTime()
    console.log('about unmounted ' + time)
  }

  render() {
    if(this.props.about && this.props.aboutReceived) {
      const { body } = this.props.about
      return(
        <div className='container'>
          <div className='row'>
            <div dangerouslySetInnerHTML={{ __html: body }} />
          </div>
          { (this.props.logged) &&
            <div className='center-align row'>
              <Link
                to={{
                  pathname: '/section',
                  section: this.props.about.section,
                  body: this.props.about.body
                }}
                style={{ all: 'unset' }} >
                <span className='btn waves-effect waves-light green lighten-1'>edit<i className='material-icons right'>edit</i></span>
              </Link>
            </div>
          }
          </div>
      )
    }

    return (
      <div className='container'>
        <p className='center-align'>Retrieving page</p>
      </div>
    )
  }
}

export default About
