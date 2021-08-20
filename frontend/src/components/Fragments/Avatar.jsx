import { Component } from 'react'

class Avatar extends Component {
  render() {

    return (
      <div className='container'>
        <div className='container'>
          <div className='row'>
            <img id='avatar' className='center=align' src={ this.props.avatar } alt='avatar'/>
          </div>
          <div className='row'>
            <span className='center-align'>{ this.props.handle }</span>
          </div>
        </div>
      </div>
    )
  }
}

export default Avatar
