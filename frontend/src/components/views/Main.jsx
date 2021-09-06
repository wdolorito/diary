import { Component } from 'react'
import Posts from '../Fragments/Posts'

class Main extends Component {
  componentDidMount() {
    const time = new Date().getTime()
    console.log('main mounted ' + time)
    this.doStartup()
  }

  componentDidUpdate() {
    const time = new Date().getTime()
    console.log('main updated ' + time)
  }

  componentWillUnmount() {
    const time = new Date().getTime()
    console.log('main unmounted ' + time)
  }

  doStartup = () => {
    if(!this.props.received) {
      this.props.getPosts()
    }
  }

  render() {
    if(this.props.received && this.props.posts.length > 1) {
      return (
        <Posts
          key='allPostsShort'
          posts={ this.props.posts }
        />
      )
    }

    if(this.props.received && this.props.posts.length === 0) {
      return (
        <div>
          <h1 className='center-align'>Nothing to see here</h1>
        </div>
      )
    }

    return null
  }
}

export default Main
