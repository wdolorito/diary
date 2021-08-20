import { Component } from 'react'
import TinyMCE from 'react-tinymce'

class PostEditor extends Component {
  handleEditorChange = (e) => {
    console.log(e.target.getContent())
  }

  render() {
    return (
      <div>
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
