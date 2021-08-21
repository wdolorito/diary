import { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import axios, { CancelToken } from 'axios'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

import Main from './components/views/Main'
import About from './components/views/About'
import Error from './components/views/Error'
import Login from './components/views/Login'
import Display from './components/views/Display'
import PostEditor from './components/views/PostEditor'

class App extends Component {
  constructor(props) {
    super(props)

    this.cancel = null

    this.state = {
      baseLink: 'http://localhost:5000/',
      loginLink: 'login',
      logoutLink: 'logout',
      refreshLink: 'refresh',
      postsLink: 'posts',
      refreshed: false,
      received: false,
      posts: [],
      jwt: '',
      logged: false
    }

    this.baseState = this.state
  }

  componentDidMount() {
    this.setLinks()
  }

  componentWillUnmount() {
    if(this.cancel !== null) this.cancel()
    this.setState(this.baseState)
  }

  componentDidUpdate() {
    if(!this.state.refreshed) this.checkLogStatus()
  }

  setLinks = () => {
    this.setState({ loginLink: this.state.baseLink + this.state.loginLink })
    this.setState({ logoutLink: this.state.baseLink + this.state.logoutLink })
    this.setState({ refreshLink: this.state.baseLink + this.state.refreshLink })
    this.setState({ postsLink: this.state.baseLink + this.state.postsLink })
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
          this.setState({ refreshed: true })
        }
      },
      (err) => {
        alert('Unable to log in.')
        this.resetJwt()
      }
    )
  }

  doRefresh = () => {
    const token = this.getToken()
    if(token) {
      axios({
        method: 'post',
        url: this.state.refreshLink,
        cancelToken: new CancelToken(c => this.cancel = c),
        data: { token: token }
      })
      .then(
        (res) => {
          console.log(res)
          if(res.status === 200) {
            this.setJwt(res.data.token)
            this.setLogged()
            this.storeToken(res.data.refresh)
            this.setState({ refreshed: true })
          }
        },
        (err) => {
          console.log(err)
        }
      )
    }
  }

  getPosts = () => {
    axios({
      method: 'get',
      url: this.state.postsLink,
      cancelToken: new CancelToken(c => this.cancel = c)
    })
    .then(
      (res) => {
        if(res.status === 200) {
          this.setState({ posts: res.data })
          this.setState({ received: true })
        }
      },
      (err) => {
        console.log(this.state.postsLink, err)
      }
    )
  }

  checkLogStatus = () => {
    if(this.getToken() !== null) {
      this.doRefresh()
    }
  }

  render() {
    return (
      <Router>
        <div className='App'>
          <Header
            logged = { this.state.logged }
          />
          <Switch>
            <Route
              exact path='/'
              render={ (props) =>
                <Main
                  { ...props }
                  key='mainDisplay'
                  getPosts={ this.getPosts }
                  posts={ this.state.posts }
                  received={ this.state.received }
                  reverse={ true }
                /> }
            />
            <Route
              exact path='/about'
              component={ About }
            />
            <Route
              exact path='/latest'
              render={ (props) =>
                <Main
                  { ...props }
                  key='latestDisplay'
                  logged={ this.state.logged }
                  getPosts={ this.getPosts }
                  posts={ this.state.posts }
                  received={ this.state.received }
                  reverse={ false }
                /> }
            />
            <Route
              path='/post'
              component={ Display }
            />
            <Route
              path='/editor'
              component={ PostEditor }
            />
            <Route
              exact path='/quixotic'
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
