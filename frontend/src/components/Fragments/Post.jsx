import { Component } from 'react'
import { Link } from 'react-router-dom'

class Post extends Component {
  render() {
    if(this.props.post) {
      const { title,
              summary,
              createdAt } = this.props.post
      const friendlyURL = title.replace(/\s+/g, '-')
                               .replace(/"/g, '')
                               .replace(/'/g, '')
                               .replace(/,/g, '')
                               .toLowerCase()
      const dispCreatedAt = new Date(createdAt).toUTCString()

      return (
        <Link
          to={{
            pathname: '/post',
            search: friendlyURL,
            post: this.props.post,
            author: this.props.author,
            logged: this.props.logged
          }}
          style={{ all: 'unset' }}>
          <div className='card-panel hoverable'>
            <div className='card-content'>
              <h4 className='card-title'>{ title }</h4>
              <em>{ dispCreatedAt }</em>
              <p className='truncate flow-text'>{ summary }</p>
            </div>
          </div>
        </Link>
      )
    }

    this.props.history.push('/')
    this.props.history.go()
  }
}

export default Post
