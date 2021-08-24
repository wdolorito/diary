import { Component } from 'react'
import Avatar from '../Fragments/Avatar'

class Display extends Component {
  render() {
    if(this.props.location.post) {
      const { title,
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

      return (
        <div className='container full-post'>
          <h2>{ title }</h2>
          <div className='row'>
            <div className='valign-wrapper'>
              <div className='col s8'>
                <h5>by { firstName } { middleName } { lastName }</h5>
              </div>
              <div className='col s4'>
                <Avatar
                  key={ handle }
                  avatar={ avatar }
                  handle={ handle }
                />
              </div>
            </div>
          </div>

          <blockquote>created: { dispCreatedAt }</blockquote>
          { (updatedAt !== createdAt ) &&
            <blockquote>updated: { dispUpdatedAt }</blockquote>
          }
          <div style={ styleFix } dangerouslySetInnerHTML={{ __html: body }} />

          { (this.props.location.logged) &&
            <button className='btn waves-effect waves-light'>edit<i className='material-icons right'>send</i></button>
          }
        </div>
      )
    }

    return null

    this.props.history.push('/')
    this.props.history.go()
  }
}

export default Display
