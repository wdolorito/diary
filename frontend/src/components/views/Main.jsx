import { Component } from 'react'
import Posts from '../Fragments/Posts'

class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {
      received: false
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidUpdate() {
    if(!this.state.received) {
      this.props.getPosts()
      this.setState({ received: true })
    }
  }

  render() {
    if(this.state.received && this.props.posts.length > 1) {
      return (
        <Posts
          key='allPostsShort'
          posts={ this.props.posts }
        />
      )
    }

    if(this.state.received && this.props.posts.length === 1) {
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
