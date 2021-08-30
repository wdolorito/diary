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
    console.log(ClassicEditor.builtinPlugins.map( plugin => plugin.pluginName ))
    if(!this.props.logged) {
      window.location = '/'
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
    const noTitle = <div className='input-field'>
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

    const hasTitle =  <div className='input-field'>
                        <input
                          type='text'
                          className='validate'
                          name='title'
                          value={ this.state.title }
                          onChange={ this.onTextInputChange }
                          required
                        />
                      </div>

    const noSummary = <div className='input-field'>
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

    const hasSummary =  <div className='input-field'>
                          <input
                            type='text'
                            className='validate'
                            name='summary'
                            value={ this.state.summary }
                            onChange={ this.onTextInputChange }
                          />
                        </div>
    return (
      <div className='container'>
        <div className='row'>
          { (!this.props.location.post) && noTitle }
          { (this.props.location.post) && hasTitle }
        </div>

        <div className='row'>
          { (!this.props.location.post) && noSummary }
          { (this.props.location.post) && hasSummary }
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
