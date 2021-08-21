import { Component } from 'react'
import Post from './Post'

class Posts extends Component {
  render() {
    const posts = this.props.posts
    let data = posts.slice(1)
    if(!this.props.reverse) data = data.reverse()

    return (
      <div className='container'>

      {
        data.map((post, index) => (
          <Post
            key={ index }
            post={ post }
            author={ posts[0] }
          />
        ))
      }

      </div>
    )
  }
}

export default Posts
