import { Component } from 'react'
import TinyMCE from 'react-tinymce'

class PostEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      summary: '',
      body: ''
    }

    this.baseState = this.state
  }

  componentWillUnmount() {
    this.resetForm()
  }

  resetForm = () => {
    this.setState(this.baseState)
  }

  handleEditorChange = (e) => {
    console.log(e.target.getContent())
  }

  render() {
    return (
      <div className='container'>
        <TinyMCE
          config={{
            plugins: 'autolink link image lists preview',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright'
          }}
          onChange={ this.handleEditorChange }
        />
      </div>
    )
  }
}

export default PostEditor
