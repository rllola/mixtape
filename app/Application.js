import React, { Component } from 'react'
import { Provider } from 'mobx-react'
import createHistory from "history/createBrowserHistory"
import { Router, Route } from 'react-router-dom'

import Constants from './utils/constants'

import Site from './stores/Site'
import Playlist from './stores/Playlist'

import Home from './scenes/Home'
import Player from './scenes/Player'
import CreateMixtape from './scenes/CreateMixtape'

const browserHistory = createHistory({
  basename: location.pathname,
  forceRefresh: false
})
const site = new Site(browserHistory)
const playlist = new Playlist(site)

let store = {
  site,
  playlist
}

class Application extends Component {
  render () {
    return (
      <Provider {...store}>
        <Router history={browserHistory}>
          <div>
            <Route exact path='/' component={Home} />
            <Route path='/playlist/:hub' component={Player} />
            <Route path='/create' component={CreateMixtape} />
            <Route path='/public' render={() => { return (<p>Hello World</p>) }} />
            <Route path='/playlists' render={() => { return (<p>Hello World</p>) }} />
          </div>
        </Router>
      </Provider>
    )
  }
}

window.history.pushState = function (state, title, url) {
  let relativeUrl = url.split(location.pathname).pop()
  store.site.pushState(state, title, relativeUrl)
}

window.history.replaceState = function (state, title, url) {
  let relativeUrl = url.split(location.pathname).pop()
  store.site.replaceState(state, title, relativeUrl)
}

export default Application
