import { Component } from 'react'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }

    this.baseState = this.state
  }

  componentDidUpdate() {
    if(this.props.logged) {
      this.props.history.push('/')
    }
  }

  componentWillUnmount() {
    this.resetForm()
  }

  resetForm = () => {
    this.setState(this.baseState)
  }

  handleInput = (e) => {
    this.setState({ [ e.target.name ]: e.target.value })
  }

  submitHandler = (e) => {
    e.preventDefault()

    this.props.doLogin(this.state.email, this.state.password)
    this.resetForm()
    this.props.history.push('/')
  }

  render() {
    return (
      <div className='container'>
        <h4 className='center-align'>Login to edit</h4>
        <div className='row'>
          <form className='col s12' onSubmit={ this.submitHandler }>
            <div className='row'>
              <div className='col s3'></div>
              <div className='input-field col s6'>
                <input
                  id='email'
                  type='email'
                  className='validate'
                  name='email'
                  value={ this.state.email }
                  onChange={ this.handleInput }
                  required
                />
                <label htmlFor='email'>Email</label>
              </div>
              <div className='col s3'></div>
            </div>
            <div className='row'>
              <div className='col s3'></div>
              <div className='input-field col s6 '>
                <input
                  id='password'
                  type='password'
                  className='validate'
                  name='password'
                  value={ this.state.password }
                  onChange={ this.handleInput }
                  required
                />
                <label htmlFor='password'>Password</label>
              </div>
              <div className='col s3'></div>
            </div>
            <div className='row'>
              <div className='col s3' />
              <div className='col s6'>
                <button className='btn waves-effect waves-light' type='submit' name='action'>
                submit<i className='material-icons right'>send</i></button>
              </div>
              <div className='col s3' />
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
