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

    this.state = {
      baseLink: 'http://localhost:5000/',
      loginLink: 'login',
      logoutLink: 'logout',
      refreshLink: 'refresh',
      postsLink: 'posts',
      postLink: 'post',
      refreshed: false,
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

    this.cancel = null
  }

  componentDidMount() {
    const time = new Date().getTime()
    console.log('app mounted ' + time)
    this.setupAxios()
    this.setLinks()
    if(!this.state.refreshed) {
      this.doRefresh()
    }
  }

  componentDidUpdate() {
    console.log(this.state.refreshed)
    if(this.state.refreshed && this.state.received) this.getPosts()
  }

  componentWillUnmount() {
    const time = new Date().getTime()
    console.log('app unmounted ' + time)
    if(this.cancel !== null) this.cancel()
    this.setState(this.baseState)
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

  setLogged = () => {
    this.setState({ logged: true })
  }

  storeToken = (token) => {
    console.log('storing token', token)
    localStorage.setItem('token', token)
  }

  getToken = () => {
    const token = localStorage.getItem('token')
    console.log('getting token', token)
    return token
  }

  resetToken = () => {
    console.log('removing token', localStorage.getItem('token'))
    localStorage.removeItem('token')
  }

  resetAbout = () => {
    console.log('about reset, contents + flag')
    this.setState({
                   about: null,
                   aboutReceived: false
                 })
  }

  setupAxios = () => {
    axios.interceptors.request.use(
      req => {
        req.cancelToken = new CancelToken(c => this.cancel = c)
        return req
      },
      err => {
        return Promise.reject(err)
      }
    )

    axios.interceptors.response.use(
      res => {
        console.log('response', res)
        return res
      },
      err => {
        const res = err.response
        const url = res.config.url
        const status = res.status
        const refresh = this.state.refreshLink
        console.log(res)
        console.log('error', url)
        console.log('error', status)
        console.log(url === refresh)
        return Promise.reject(err)
      }
    )
  }

  doAxios = async (params, success, fail) => {
    try {
      await axios(params)
        .then(res => {
          success(res)
        },
        err => {
          fail(err)
        })
    } catch(err) {
      console.log('axios failed', err)
    }
  }

  doLogin = (log, pass) => {
    const loginLink = this.state.loginLink
    if(loginLink.length > 5) {
      const params = {
        method: 'post',
        url: loginLink,
        data: {
          email: log,
          password: pass
        }
      }

      const success = (res) => {
        if(res.status === 200) {
          this.setJwt(res.data.token)
          this.setLogged()
          this.storeToken(res.data.refresh)
          this.setState({ refreshed: true })
        }
      }

      const fail = (err) => {
        alert('Unable to log in.')
        this.resetJwt()
      }

      this.doAxios(params, success, fail)
    } else {
      setTimeout(() => {
        if(this.cancel !== null) this.cancel()
        this.doLogin(log, pass)
      }, 100)
    }
  }

  doLogout = () => {
    const logoutLink = this.state.logoutLink
    if(logoutLink.length > 6) {
      const token = this.getToken()
      const fail = (err) => {
        this.resetJwt()
        console.log('in logout')
        this.resetToken()
        this.setState({ received: false })
      }

      if(token) {
        const params = {
          method: 'post',
          url: logoutLink,
          headers: {
            'Authorization': 'Bearer ' + this.state.jwt
          },
          data: { token }
        }

        this.doAxios(params, fail, fail)
      } else {
        fail('reset authentication')
      }
    } else {
      if(this.cancel !== null) this.cancel()
      this.doLogout()
    }
  }

  doRefresh = () => {
    const token = this.getToken()
    if(token) {
      const refreshLink = this.state.refreshLink
      if(refreshLink.length > 7) {
        const params = {
          method: 'post',
          url: refreshLink,
          data: { token }
        }

        const success = (res) => {
          if(res.status === 200) {
            this.setJwt(res.data.token)
            this.setLogged()
            this.storeToken(res.data.refresh)
            this.setState({ refreshed: true })
          }
        }

        const fail = (err) => {
          this.resetJwt()
          console.log('in refresh', err)
          this.resetToken()
        }

        this.doAxios(params, success, fail)
      } else {
        setTimeout(() => {
          if(this.cancel !== null) this.cancel()
          this.doRefresh()
        }, 100)
      }
    }
  }

  getPosts = () => {
    const postsLink = this.state.postsLink
    if(postsLink.length > 5) {
      const params = {
        method: 'get',
        url: postsLink,
      }

      const success = (res) => {
        if(res.status === 200) {
          this.setState({ posts: res.data })
        }
      }

      const fail = (err) => {
        console.log('get posts error ', postsLink, err)
      }

      if(!this.state.received) {
        console.log('getting posts')
        this.doAxios(params, success, fail)
        this.setState({ received: true })
      }
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
      if(type !== 'get') options.headers = { 'Authorization': 'Bearer ' + this.state.jwt }
      if(payload) options.data = payload

      const success = (res) => {
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
                          lookUpReceived: true })
          }
        }
      }

      const fail = (err) => {
        console.log(this.state.postLink)
        console.log(err.response.status)
      }

      this.doAxios(options, success, fail)
    } else {
      setTimeout(() => {
        if(this.cancel !== null) this.cancel()
        this.callPost(type, payload, id)
      }, 100)
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
