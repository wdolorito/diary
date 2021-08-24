import { Component} from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

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

  componentDidMount() {
    console.log(ClassicEditor.builtinPlugins.map( plugin => plugin.pluginName ))
    if(!this.props.logged) {
      this.props.history.push('/')
    }
  }

  componentWillUnmount() {
    this.resetForm()
  }

  onTextInputChange = (e) => {
    this.setState({ [ e.target.name ]: e.target.value })
  }

  onEditorChange = (e, editor) => {
    const body = editor.getData();
    this.setState({ body })
  }

  submitForm = (e) => {
    e.preventDefault()
    const title = this.state.title
    const summary = this.state.summary
    const body = this.state.body
    const payload = {}

    if(title && body) {
      payload.title = title
      payload.body = body
      if(summary) {
        payload.summary = summary
      } else {
        payload.summary = body.replace(/<[^>]+>/g, '')
      }
      this.props.doPost(payload)
      this.props.history.push('/latest')
    } else {
      let msg = 'Please add '
      if(!title) msg += 'a title'
      if(!body) msg += 'and some content'
      msg = msg.replace(/titleand/g, 'title and')
      msg = msg.replace(/add\ and/g, 'add')
      msg += '.'
      alert(msg)
    }
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
            onChange={ this.onTextInputChange }
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
            onChange={ this.onTextInputChange }
            placeholder='Summary'
          />
          <label htmlFor='summary'>Summary</label>
        </div>
      </div>

      <div className='row'>
        <CKEditor
            editor={ ClassicEditor }
            data={ this.state.body }
            onChange={ this.onEditorChange }
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
