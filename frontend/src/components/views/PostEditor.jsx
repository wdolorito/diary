import { Component} from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

class PostEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      summary: '',
      body: '',
      editor: null,
      ready: false
    }

    this.baseState = this.state
  }

  componentDidMount() {
    const time = new Date().getTime()
    console.log('post editor mounted ' + time)
    if(!this.props.logged) {
      window.location = '/'
    }
    if(window.$('input#title, input#summary').length > 0) {
      this.initCharacterCounter()
    } else {
      setTimeout(this.initCharacterCounter, 100)
    }
  }

  componentDidUpdate() {
    const time = new Date().getTime()
    console.log('post editor updated ' + time)
    if(this.props.location.post) {
      if(this.state.ready) {
        this.setState({ ready: false })
        this.updateEditor()
      }
    }
  }

  componentWillUnmount() {
    const time = new Date().getTime()
    console.log('post editor unmounted ' + time)
    this.resetForm()
  }

  initCharacterCounter = () => {
    window.$('input#title, input#summary').characterCounter()
  }

  setEditor = (editor) => {
    this.setState({
                    ready: true,
                    editor: editor
                  })
  }

  onTextInputChange = (e) => {
    this.setState({ [ e.target.name ]: e.target.value })
  }

  onEditorChange = (e, editor) => {
    const body = editor.getData();
    this.setState({ body })
  }

  updateEditor = () => {
    const editor = this.state.editor
    if(editor !== null) {
      const { title, summary, body } = this.props.location.post
      this.setState({ title, summary, body }, editor.setData(body))
    }
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
      if(this.props.location.post !== undefined) {
        this.props.callPost('put', payload, this.props.location.post._id)
      } else {
        this.props.callPost('post', payload)
      }
      this.props.history.push('/')
    } else {
      let msg = 'Please add '
      if(!title) msg += 'a title'
      if(!body) msg += 'and some content'
      msg = msg.replace(/titleand/g, 'title and')
      msg = msg.replace(/add and/g, 'add')
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
              id='title'
              value={ this.state.title }
              onChange={ this.onTextInputChange }
              placeholder='Title'
              data-length='90'
              maxLength='90'
              required
            />
            { (!this.props.location.post) && <label htmlFor='title'>Title</label> }
          </div>
        </div>

        <div className='row'>
          <div className='input-field'>
            <input
              type='text'
              className='validate'
              name='summary'
              id='summary'
              value={ this.state.summary }
              onChange={ this.onTextInputChange }
              data-length='138'
              maxLength='138'
              placeholder='Summary'
            />
            { (!this.props.location.post) && <label htmlFor='summary'>Summary</label> }
          </div>
        </div>

        <div className='row'>
          <CKEditor
              editor={ ClassicEditor }
              data={ this.state.body }
              onReady={ editor => this.setEditor(editor) }
              onChange={ this.onEditorChange }
          />
        </div>

        <div className='row'>
          <div className='col s12 right-align'>
            <span className='btn waves-effect waves-light blue lighten-1' onClick={ this.submitForm } name='action'>submit<i className='material-icons right'>send</i></span>
          </div>
        </div>
      </div>
    )
  }
}

export default PostEditor
