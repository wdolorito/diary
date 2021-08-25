import { Component } from 'react'

class Error extends Component {
  render() {
    const imgStyleFix = {
      maxWidth: '100%',
      height: 'auto'
    }

    return (
      <div>
        <div className='center-align'>
          <img style={ imgStyleFix } alt='error_image' src='http://lorempixel.com/640/480/nature' />
        </div>
        <h3 className='center-align'>This section does not exist.</h3>
      </div>
    )
  }
}

export default Error
