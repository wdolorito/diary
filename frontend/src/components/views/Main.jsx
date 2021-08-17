import { Component } from 'react'

class Main extends Component {
  componentDidMount() {
  }

  componentDidUpdate() {
    this.props.getPosts()
  }

  render() {
    return (
      <div>This is the main page.</div>
    )
  }
}

export default Main
