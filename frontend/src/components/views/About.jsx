import { Component } from 'react'
import { Link } from 'react-router-dom'

class About extends Component {
  constructor(props) {
    super(props)

    this.state = {
      updated: false
    }
  }
  componentDidMount() {
    const time = new Date().getTime()
    console.log('about mounted ' + time)
    if(!this.state.updated) {
      this.setState({ updated: true }, this.props.callPost('get', null, 'static?about'))
    }
  }

  componentDidUpdate() {
    const time = new Date().getTime()
    console.log('about updated ' + time)
    if(!this.state.updated) {
      this.setState({ updated: true }, this.props.callPost('get', null, 'static?about'))
    }
  }

  render() {
    if(this.props.about && this.props.aboutReceived) {
      const { body } = this.props.about
      return(
        <div className='container'>
          <div dangerouslySetInnerHTML={{ __html: body }} />

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
