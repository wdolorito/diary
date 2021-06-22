import { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

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
            <Route
              path='/quixotic'
              component={ Login }
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
