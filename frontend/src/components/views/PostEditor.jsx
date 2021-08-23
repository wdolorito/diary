import React from 'react'
import { EditorState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'

class PostEditor extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      summary: '',
      body: '',
      editorState: null
    }

    this.baseState = this.state
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.resetForm()
  }

  onInputStateChange = (e) => {
    this.setState({ [ e.target.name ]: e.target.value })
    console.log(e.target.value)
  }

  onEditorStateChange = (editorState) => {
    const body = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    this.setState({ editorState, body })
    console.log(body)
  }

  submitForm = (e) => {
    e.preventDefault()
    const title = this.state.title
    const summary = this.state.summary
    const body = this.state.body
    const payload = { title, summary, body }
    console.log(payload)
  }

  resetForm = () => {
    this.setState(this.baseState)
  }

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='input-field'>
            <input
              type='text'
              className='validate'
              name='title'
              value={ this.state.title }
              onChange={ this.onInputStateChange }
              placeholder='Title'
              required
            />
            <label htmlFor='title'>Title</label>
          </div>
        </div>

        <div className='row'>
          <div className='input-field'>
            <input
              type='text'
              className='validate'
              name='summary'
              value={ this.state.summary }
              onChange={ this.onInputStateChange }
              placeholder='Summary'
              required
            />
            <label htmlFor='summary'>Summary</label>
          </div>
        </div>

        <div className='row'>
          <Editor
            editorState={ this.state.editorState }
            onEditorStateChange={ this.onEditorStateChange }
          />
        </div>

        <div className='row'>
          <div className='col s3' />
          <div className='col s6 center-align'>
            <button className='btn waves-effect waves-light' onClick={ this.submitForm } name='action'>submit<i className='material-icons right'>send</i></button>
          </div>
          <div className='col s3' />
        </div>
      </div>
    )
  }
}

export default PostEditor
