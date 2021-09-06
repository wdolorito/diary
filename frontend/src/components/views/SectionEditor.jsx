import { Component} from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

class SectionEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      section: '',
      body: '',
      editor: null,
      ready: false
    }

    this.baseState = this.state
  }

  componentDidMount() {
    const time = new Date().getTime()
    console.log('section editor mounted ' + time)
    if(!this.props.logged) {
      window.location = '/'
    }
  }

  componentDidUpdate() {
    const time = new Date().getTime()
    console.log('section editor updated ' + time)
    if(this.props.location.section) {
      if(this.state.ready) {
        this.setState({ ready: false })
        this.updateEditor()
      }
    }
  }

  componentWillUnmount() {
    const time = new Date().getTime()
    console.log('section editor unmounted ' + time)
    this.resetForm()
  }

  setEditor = (editor) => {
    this.setState({
                    ready: true,
                    editor: editor
                  })
  }

  onEditorChange = (e, editor) => {
    const body = editor.getData();
    this.setState({ body })
  }

  updateEditor = () => {
    const editor = this.state.editor
    if(editor !== null) {
      const section = this.props.location.section
      const body = this.props.location.body
      this.setState({ section, body }, editor.setData(body))
    }
  }

  submitForm = (e) => {
    e.preventDefault()
    const section = this.state.section
    const body = this.state.body
    const payload = { body, section }

    this.props.resetAbout()
    this.props.callPost('put', payload, 'static?' + section)
    this.props.history.push('/')
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
              name='title'
              value={ this.state.section }
              disabled
            />
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

export default SectionEditor
