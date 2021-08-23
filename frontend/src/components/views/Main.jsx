import { Component } from 'react'
import Posts from '../Fragments/Posts'

class Main extends Component {
  componentDidMount() {
    if(!this.props.received) {
      this.props.getPosts()
    }
  }

  componentWillUnmount() {
  }

  componentDidUpdate() {
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
          reverse={ this.props.reverse }
        />
      )
    }

    if(this.props.received && this.props.posts.length === 1) {
      return (
        <div className='container'>
          <h1>Nothing to see here</h1>
        </div>
      )
    }

    return null
  }
}

export default Main
