import { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import axios, { CancelToken } from 'axios'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

import Main from './components/views/Main'
import About from './components/views/About'
import Error from './components/views/Error'
import Latest from './components/views/Latest'
import Login from './components/views/Login'
import Posts from './components/views/Posts'
import PostEditor from './components/Fragments/PostEditor'

class App extends Component {
  constructor(props) {
    super(props)

    this.cancel = null

    this.state = {
      baseLink: 'http://192.168.15.20:5000/',
      loginLink: 'login',
      jwt: '',
      refreshToken: '',
      didRefresh: false,
      logged: false
    }

    this.baseState = this.state
  }

  componentDidMount() {
    this.setState({ loginLink: this.state.baseLink + this.state.loginLink })
  }

  componentWillUnmount() {
    if(this.cancel !== null) this.cancel()
    this.setState(this.baseState)
  }

  componentDidUpdate() {
    if(this.state.jwt === '' && !this.state.didRefresh) {
      this.setState({ didRefresh: true }, this.doRefresh())
    }
  }

  setJwt = (newjwt) => {
    this.setState({ jwt: newjwt })
  }

  resetJwt = () => {
    this.setState({ jwt: '',
                    logged: false })
  }

  storeToken = (token) => {
    localStorage.setItem('token', token)
  }

  getToken = () => {
    return localStorage.getItem('token')
  }

  resetToken = () => {
    localStorage.removeItem('token')
    this.setState({ didRefresh: false })
  }

  setLogged = () => {
    this.setState({ logged: true })
  }

  doLogin = (log, pass) => {
    axios({
      method: 'post',
      url: this.state.loginLink,
      cancelToken: new CancelToken(c => this.cancel = c),
      data: {
        email: log,
        password: pass
      }
    })
    .then(
      (res) => {
        if(res.status === 200) {
          this.setJwt(res.data.token)
          this.setLogged()
          this.storeToken(res.data.refresh)
          this.setState({ didRefresh: true })
        }
      },
      (err) => {
        alert('Unable to log in.')
        this.resetJwt()
      }
    )
  }

  doRefresh = () => {
    // const storedToken = this.getToken()
    // if(storedToken) {
    //   axios({
    //     method: 'post',
    //     url: this.state.refreshLink,
    //     cancelToken: new CancelToken(c => this.cancel = c),
    //     headers: {
    //       'Authorization': 'Bearer ' + storedToken
    //     }
    //   })
    //   .then(
    //     (res) => {
    //       if(res.status === 200) {
    //         this.setJwt(res.data.token)
    //         this.setLogged()
    //         this.storeToken(res.data.refresh)
    //       }
    //     },
    //     (err) => {
    //       this.resetJwt()
    //       this.resetToken()
    //     }
    //   )
    // }
  }

  render() {
    return (
      <Router>
        <div className='App'>
          <Header />
          <Switch>
            <Route
              exact path='/'
              component={ Main }
            />
            <Route
              path='/about'
              component={ About }
            />
            <Route
              path='/latest'
              component={ Latest }
            />
            <Route
              path='/posts'
              component={ Posts }
            />
            <Route
              path='/editor'
              component={ PostEditor }
            />
            <Route exact path='/quixotic'
              render={ (props) =>
                <Login
                  { ...props }
                  key='loginDisplay'
                  logged={ this.state.logged }
                  doLogin={ this.doLogin }
                /> }
            />
            <Route
              component={ Error }
            />
          </Switch>
          <Footer />
        </div>
      </Router>
    )
  }
}

export default App
