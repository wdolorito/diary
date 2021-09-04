import { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import axios, { CancelToken } from 'axios'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

import Main from './components/views/Main'
import About from './components/views/About'
import Error from './components/Fragments/Error'
import Login from './components/views/Login'
import Display from './components/views/Display'
import PostEditor from './components/views/PostEditor'
import SectionEditor from './components/views/SectionEditor'

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
      lookUp: null,
      lookUpReceived: false,
      about: null,
      aboutReceived: false,
      jwt: '',
      logged: false
    }

    this.baseState = this.state
  }

  componentDidMount() {
    const time = new Date().getTime()
    console.log('app mounted ' + time)
    this.setLinks()
  }

  componentDidUpdate() {
    console.log(!this.state.refreshed, !this.state.inRefresh)
    if(!this.state.refreshed && !this.state.inRefresh) {
      this.setState({ inRefresh: true }, this.checkLogStatus())
    }
  }

  componentWillUnmount() {
    const time = new Date().getTime()
    console.log('app unmounted ' + time)
    if(this.cancel !== null) this.cancel()
    this.setState(this.baseState)
  }

  checkLogStatus = () => {
    if(this.getToken() !== null) {
      this.doRefresh()
    }
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

  getToken = () => {
    console.log('getting token')
    const token = localStorage.getItem('token')
    return token
  }

  storeToken = (token) => {
    console.log('storing: ', token)
    localStorage.setItem('token', token)
  }

  resetToken = () => {
    console.log('removing: ', this.getToken())
    localStorage.removeItem('token')
  }

  setLogged = () => {
    this.setState({ logged: true })
  }

  doLogin = (log, pass) => {
    const loginLink = this.state.loginLink
    if(loginLink.length > 5) {
      axios({
        method: 'post',
        url: loginLink,
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
    } else {
      setTimeout(() => {
        if(this.cancel !== null) this.cancel()
        this.doLogin(log, pass)
      }, 100)
    }
  }

  doRefresh = (params, cb) => {
    const token = this.getToken()
    if(token) {
      this.refreshAxios(token, params, cb)
    }
  }

  refreshAxios = (token, params, cb) => {
    setTimeout(() => {
      const refreshLink = this.state.refreshLink
      if(refreshLink.length > 7) {
        axios({
          method: 'post',
          url: refreshLink,
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
              if(typeof(cb) === 'function') {
                const { type, payload, id } = params
                cb(type, payload, id)
              }
            }
          },
          (err) => {
            console.log(err)
            this.resetJwt()
            this.resetToken()
          }
        )
      } else {
        setTimeout(() => {
          if(this.cancel !== null) this.cancel()
          this.refreshAxios(token, params, cb)
        })
      }
    }, 100)
  }

  doLogout = () => {
    const logoutLink = this.state.logoutLink
    if(logoutLink.length > 6) {
      const token = this.getToken()
      if(token) {
        axios({
          method: 'post',
          url: logoutLink,
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
    } else {
      if(this.cancel !== null) this.cancel()
      this.doLogout()
    }
  }

  getPosts = () => {
    const postsLink = this.state.postsLink
    if(postsLink.length > 5) {
      axios({
        method: 'get',
        url: postsLink,
        cancelToken: new CancelToken(c => this.cancel = c)
      })
      .then(
        (res) => {
          if(res.status === 200) {
            this.setState({ posts: res.data })
          }
        },
        (err) => {
          console.log('get posts error ', postsLink)
          console.log(err)
        }
      )

      this.setState({ received: true })
    } else {
      setTimeout(() => {
        if(this.cancel !== null) this.cancel()
        this.getPosts()
      }, 100)
    }
  }

  callPost = (type, payload, id) => {
    const postLink = this.state.postLink
    if(postLink.length > 4) {
      let link = postLink
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
            if(id) {
              const isStatic = id.substring(0, 6)
              if(isStatic === 'static') {
                this.setState({
                              about: res.data,
                              aboutReceived: true
                             })
              } else {
                this.setState({
                              received: false,
                              lookUp: res.data,
                              lookUpReceived: true }, this.getPosts())
              }
            } else {
              this.getPosts()
            }

            if(res.status === 401) {
              this.setState({ refreshed: false },
                () => {
                  const params = { type, payload, id }
                  this.doRefresh(params, this.callPost)
                })
            }
          },
          (err) => {
            console.log(this.state.postLink)
            console.log(err)
          }
        )
    } else {
      setTimeout(() => {
        if(this.cancel !== null) this.cancel()
        this.callPost(type, payload, id)
      }, 100)
    }
  }

  resetAbout = () => {
    console.log('about reset, contents + flag')
    this.setState({
                   about: null,
                   aboutReceived: false
                 })
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
              render={ (props) =>
                <About
                  { ...props }
                  key='aboutDisplay'
                  logged={ this.state.logged }
                  callPost={ this.callPost }
                  about={ this.state.about }
                  aboutReceived={ this.state.aboutReceived }
                /> }
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
                  logged={ this.state.logged }
                  callPost={ this.callPost }
                  lookUp={ this.state.lookUp }
                  lookUpReceived={ this.state.lookUpReceived }
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
              exact path='/section'
              render={ (props) =>
                <SectionEditor
                  { ...props }
                  key='sectionEditorDisplay'
                  logged={ this.state.logged }
                  callPost={ this.callPost }
                  resetAbout={ this.resetAbout }
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
