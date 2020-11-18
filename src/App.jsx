import { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

import Main from './components/views/Main'
import About from './components/views/About'
import Latest from './components/views/Latest'
import Posts from './components/views/Posts'
import PostEditor from './components/Fragments/PostEditor'


class App extends Component {
  render() {
    return (
      <Router>
        <div className='App'>
            <Header />
            <Route
              exact path='/'
              render={ (props) => <Main /> }
            />
            <Route
              exact path='/about'
              render={ (props) => <About /> }
            />
            <Route
              exact path='/latest'
              render={ (props) => <Latest /> }
            />
            <Route
              exact path='/posts'
              render={ (props) => <Posts /> }
            />
            <Route
              exact path='/editor'
              render={ (props) => <PostEditor /> }
            />
            <Footer />
        </div>
      </Router>
    )
  }
}

export default App
