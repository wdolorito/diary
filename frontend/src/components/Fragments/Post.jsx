import { Component } from 'react'

class Post extends Component {
  render() {
    const { title,
            body } = this.props.post

    return (
      <div className='row'>
        <div className='col s12'>
          <div className='card'>
            <div className='card-content'>
              <span className='card-title'>{ title }</span>
              <p>{ body }</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Post
