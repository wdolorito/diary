import { Component } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../Fragments/Avatar'
import Error from '../Fragments/Error'
import crypto from 'crypto'
import queryString from 'query-string'

class Display extends Component {
  constructor(props) {
    super(props)

    this.state = {
      passed: true,
      qs: '',
      ready: false
    }

    this.baseState = this.state
  }

  componentDidMount() {
    const time = new Date().getTime()
    console.log('display mounted ' + time)
    if(this.props.location.search) {
      this.setState({ passed: false })
    }
  }

  componentDidUpdate() {
    const time = new Date().getTime()
    console.log('display updated ' + time)
    if(!this.state.passed && !this.props.lookUpReceived) {
      this.setState({ passed: true })
      const qs = queryString.parse(this.props.location.search)
      this.setState({ qs })
      this.getPostByHash(qs.title)
    }

    if(this.props.lookUpReceived && this.props.lookUp !== undefined && !this.state.ready) {
      this.setState({ ready: true })
    }
  }

  componentWillUnmount() {
    const time = new Date().getTime()
    console.log('display unmounted ' + time)
    this.setState(this.baseState)
  }

  handleDelete = () => {
    const id = this.props.location.post._id
    this.props.callPost('delete', null, id)
    window.location = '/'
  }

  getPostByHash = (title) => {
    const hash = this.getTitleHash(title)
    this.props.callPost('get', null, hash)
  }

  getTitleHash = (title) => {
    return crypto.createHash('sha1').update(title).digest('hex')
  }

  render() {
    let author, post
    if(this.props.location.post) {
      author = this.props.location.author
      post = this.props.location.post
    } else if(this.state.ready && this.props.lookUp[1]) {
      author = this.props.lookUp[0]
      post = this.props.lookUp[1]
    } else if(this.state.ready && !this.props.lookUp[1]) {
      return <Error />
    } else {
      return null
    }

    const { title,
            summary,
            body,
            createdAt,
            updatedAt } = post
    const dispCreatedAt = new Date(createdAt).toUTCString()
    const dispUpdatedAt = new Date(updatedAt).toUTCString()

    const { avatar,
            firstName,
            middleName,
            lastName,
            handle } = author
    const blockQuote1 = {
      borderColor: '#1976d2'
    }

    return (
      <div className='container'>
        <h2 >{ title }</h2>
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

        <div className='row'>
          <div dangerouslySetInnerHTML={{ __html: body }} />
        </div>

        { (this.props.logged) &&
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
  }
}

export default Display
