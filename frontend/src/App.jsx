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
        data: { token }
      })
      .then(
        (res) => {
          if(res.status === 200) {
            this.setJwt(res.data.token)
            this.setLogged()
            this.storeToken(res.data.refresh)
          }
        },
        (err) => {
          this.resetJwt()
          this.resetToken()
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

  render() {
    return (
      <Router>
        <div className='App'>
          <Header />
          <Switch>
            <Route
              exact path='/'
              render={ (props) =>
                <Main
                  { ...props }
                  key='mainDisplay'
                  logged={ this.state.logged }
                  getPosts={ this.getPosts }
                  posts={ this.state.posts }
                  received={ this.state.received }
                  reverse={ true }
                /> }
            />
            <Route
              path='/about'
              component={ About }
            />
            <Route
              path='/latest'
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
              path='/posts'
              component={ Posts }
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
