import { Component } from 'react'
import Post from './Post'

class Posts extends Component {
  render() {
    const posts = this.props.posts
    const { avatar,
            firstName,
            middleName,
            lastName,
            handle } = posts[0]
    const data = posts.slice(1)

    return (
      <div className='container'>
        <div className='row'>
          <div className='col s1'/>
          <div className='col s11'>
            <h6>brought to you by:</h6>
          </div>
        </div>
        <div className='row'>
          <h2 className='center-align'>{ firstName } { middleName } { lastName }</h2>
        </div>
        <div className='row'>
          <div className='col s8'/>
          <div className='col s4'>
            <blockquote>AKA { handle }</blockquote>
          </div>
        </div>

      { data.map((post, index) => (
        <Post
          key={ index }
          post={ post }
        />
      )) }

      </div>
    )
  }
}

export default Posts
