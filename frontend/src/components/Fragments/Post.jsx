import { Component } from 'react'

class Post extends Component {
  render() {
    const { title,
            summary } = this.props.post

    const styleFix = {
                       wordBreak: 'break-word'
                     }

    return (
      <div className='row'>
        <div className='col s12'>
          <div className='card'>
            <div className='card-content'>
              <span className='card-title'>{ title }</span>
              <p style={ styleFix }>{ summary }</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Post
