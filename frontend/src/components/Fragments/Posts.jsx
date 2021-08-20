import { Component } from 'react'
import Post from './Post'

class Posts extends Component {
  render() {
    const posts = this.props.posts
    const data = posts.slice(1)

    return (
      <div className='container'>

      { data.map((post, index) => (
        <Post
          key={ index }
          post={ post }
          author={ posts[0] }
        />
      )) }

      </div>
    )
  }
}

export default Posts
