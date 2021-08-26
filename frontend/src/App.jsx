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
      postLink: 'post',
      refreshed: false,
      inRefresh: false,
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
    if(!this.state.refreshed && !this.state.inRefresh) this.checkLogStatus()
  }

  setLinks = () => {
    this.setState({
                    loginLink: this.state.baseLink + this.state.loginLink,
                    logoutLink: this.state.baseLink + this.state.logoutLink,
                    refreshLink: this.state.baseLink + this.state.refreshLink,
                    postsLink: this.state.baseLink + this.state.postsLink,
                    postLink: this.state.baseLink + this.state.postLink
                  })
  }

  setJwt = (newjwt) => {
    this.setState({ jwt: newjwt })
  }

  resetJwt = () => {
    this.setState({
                    jwt: '',
                    logged: false
                  })
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
    this.setState({ inRefresh: true }, () => {
        const token = this.getToken()
        if(token) {
          axios({
            method: 'post',
            url: this.state.refreshLink,
            cancelToken: new CancelToken(c => this.cancel = c),
            data: { token }
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
              this.resetJwt()
              this.resetToken()
            }
          )
        }
      }
    )
  }

  doLogout = () => {
    const token = this.getToken()
    if(token) {
      axios({
        method: 'post',
        url: this.state.logoutLink,
        cancelToken: new CancelToken(c => this.cancel = c),
        headers: {
          'Authorization': 'Bearer ' + this.state.jwt
        },
        data: { token }
      })
      .then((res, err) => {
        this.resetJwt()
        this.resetToken()
        this.setState({ received: false }, this.getPosts())
      })
    }
  }

  getPosts = () => {
    const pLL = this.state.postsLink.length
    if(pLL > 5) {
      axios({
        method: 'get',
        url: this.state.postsLink,
        cancelToken: new CancelToken(c => this.cancel = c)
      })
      .then(
        (res) => {
          if(res.status === 200) {
            this.setState({
                            posts: res.data,
                            received: true
                          })
          }
        },
        (err) => {
          console.log(this.state.postsLink)
          console.log(err.response)
        }
      )
    }
  }

  callPost = (type, payload, id) => {
    const pLL = this.state.postLink.length
    if(pLL > 4) {
      let link = this.state.postLink
      if(id) link += '/' + id
      const options = {}
      options.method = type
      options.url = link
      options.cancelToken = new CancelToken(c => this.cancel = c)
      if(type !== 'get') options.headers = { 'Authorization': 'Bearer ' + this.state.jwt }
      if(payload) options.data = payload

      axios(options)
        .then(
          (res) => {
            this.setState({ received: false }, this.getPosts())
          },
          (err) => {
            console.log(this.state.postLink)
            console.log(err)
          }
        )
    }
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
            doLogout = { this.doLogout }
          />
          <Switch>
            <Route
              exact path='/'
              render={ (props) =>
                <Main
                  { ...props }
                  key='mainDisplay'
                  logged = { this.state.logged }
                  getPosts={ this.getPosts }
                  posts={ this.state.posts }
                  received={ this.state.received }
                /> }
            />
            <Route
              exact path='/about'
              component={ About }
            />
            <Route
              exact path='/editor'
              render={ (props) =>
                <PostEditor
                  { ...props }
                  key='editorDisplay'
                  logged={ this.state.logged }
                  callPost={ this.callPost }
                /> }
            />
            <Route
              exact path='/post'
              render={ (props) =>
                <Display
                  { ...props }
                  key='postDisplay'
                  callPost={ this.callPost }
                /> }
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
              exact path='/update'
              render={ (props) =>
                <PostEditor
                  { ...props }
                  key='updatePostDisplay'
                  logged={ this.state.logged }
                  callPost={ this.callPost }
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
