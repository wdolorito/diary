import { Component } from 'react'
import Post from './Post'

class Posts extends Component {
  render() {
    const posts = this.props.posts
    let data = posts.slice(1)

    return (
      <div className='container'>

      {
        data.map((post, index) => (
          <Post
            key={ index }
            post={ post }
            author={ posts[0] }
            logged={ this.props.logged }
          />
        ))
      }

      </div>
    )
  }
}

export default Posts
