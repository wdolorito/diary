import { Component } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../Fragments/Avatar'
import queryString from 'query-string'

class Display extends Component {
  constructor(props) {
    super(props)

    this.state = {
      passed: true,
      qs: ''
    }
  }

  componentDidMount() {
    if(this.props.location.search) {
      this.setState({ passed: false })
    }
  }

  componentDidUpdate() {
    if(!this.state.passed) {
      this.setState({ passed: true })
      const qs = queryString.parse(this.props.location.search)
      this.setState({ qs })
    }

    // if(this.state.qs) console.log(this.state.qs)
  }

  handleDelete = () => {
    const id = this.props.location.post._id
    this.props.callPost('delete', null, id)
    window.location = '/'
  }

  render() {
    if(this.props.location.post) {
      const { title,
              summary,
              body,
              createdAt,
              updatedAt } = this.props.location.post
      const dispCreatedAt = new Date(createdAt).toUTCString()
      const dispUpdatedAt = new Date(updatedAt).toUTCString()

      const { avatar,
              firstName,
              middleName,
              lastName,
              handle } = this.props.location.author

      const styleFix = {
        wordBreak: 'break-word'
      }

      const blockQuote1 = {
        borderColor: '#1976d2'
      }

      return (
        <div className='container full-post'>
          <h2>{ title }</h2>
          <blockquote style={ blockQuote1 }><h6><em>{ summary }</em></h6></blockquote>
          <div className='row'>
            <div className='valign-wrapper'>
              <div className='col s1' />
              <div className='col s6'>
                <h5>by { firstName } { middleName } { lastName }</h5>
              </div>
              <div className='col s5'>
                <Avatar
                  key={ handle }
                  avatar={ avatar }
                  handle={ handle }
                />
              </div>
            </div>
          </div>

          <blockquote>
            <div className='row'>
              <div className='col s2 right-align'>
                created:
              </div>
              <div className='col s10'>
                { dispCreatedAt }
              </div>
            </div>
            { (updatedAt !== createdAt ) &&
              <div className='row'>
                <div className='col s2 right-align'>
                  updated:
                </div>
                <div className='col s10'>
                  { dispUpdatedAt }
                </div>
              </div>
            }
          </blockquote>
          <div style={ styleFix } dangerouslySetInnerHTML={{ __html: body }} />

          { (this.props.location.logged) &&
            <div className='row'>
              <div className='col s6'>
                <div className='center-align'>
                  <Link
                    to={{
                      pathname: '/update',
                      post: this.props.location.post
                    }}
                    style={{ all: 'unset' }} >
                    <span className='btn waves-effect waves-light green lighten-1'>edit<i className='material-icons right'>edit</i></span>
                  </Link>
                </div>
              </div>
              <div className='col s6'>
                <div className='center-align'>
                  <span className='btn waves-effect waves-light red lighten-1' onClick={ this.handleDelete }>delete<i className='material-icons right'>delete</i></span>
                </div>
              </div>
            </div>
          }
        </div>
      )
    } else {
      if(this.state.qs) {
        const title = this.state.qs.title
        console.log(this.state.qs.title)

        return(
          <h1>{ title }</h1>
        )
      }

      // this.props.history.push('/')
      // this.props.history.go()
    }

    return null
  }
}

export default Display
