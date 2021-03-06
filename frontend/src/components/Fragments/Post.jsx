import { Component } from 'react'
import { Link } from 'react-router-dom'

class Post extends Component {
  render() {
    if(this.props.post) {
      const { title,
              friendlyURL,
              summary,
              createdAt } = this.props.post
      const dispCreatedAt = new Date(createdAt).toUTCString()

      return (
        <Link
          to={{
            pathname: '/post',
            search: 'title=' + friendlyURL,
            post: this.props.post,
            author: this.props.author
          }}
          style={{ all: 'unset' }} >
          <div className='card-panel hoverable'>
            <div className='card-content'>
              <h4 className='card-title'>{ title }</h4>
              <em>{ dispCreatedAt }</em>
              <p className='flow-text'>{ summary }</p>
            </div>
          </div>
        </Link>
      )
    }
  }
}

export default Post
