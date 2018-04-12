import React, { Component } from 'react'
import { Sidebar, Grid, Loader } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import { Link } from 'react-router-dom'

import SidebarPlaylist from './components/SidebarPlaylist'

@inject('site', 'playlist')
@observer
class Player extends Component {
  @observable visible = true
  @observable fetching = true

  componentDidMount () {
    this.hub = this.props.match.params.hub
    this.player = document.getElementById('audioPlayer')

    this.props.playlist.on('songChanged', () => {
      this._loadAndPlay()
    })

    // Need to be done before loading component
    this.props.playlist.fetchSongsByHub(this.hub)
      .then(() => {
        if (this.props.playlist.src) {
          this.player.src = this.props.playlist.src
        }
        this.fetching = false
      })
  }

  onEnded (event) {
    this.props.playlist.playNextSong()
    if (this.props.playlist.index) {
      this._loadAndPlay()
    }
  }

  _loadAndPlay () {
    this.player.src = this.props.playlist.src
    this.player.load()
    this.player.play()
  }

  handleToggleClick () {
    this.visible = !this.visible
  }

  render () {
    const togglerStyle = {
      WebkitUserSelect: 'none', /* Safari */
      MozUserSelect: 'none', /* Firefox */
      MsUserSelect: 'none', /* IE10+/Edge */
      userSelect: 'none', /* Standard */
      color: 'white',
      fontSize: '30px',
      cursor: 'pointer',
      marginLeft: '20px'
    }

    return (
      <Sidebar.Pushable style={{ height: '100vh' }}>
        <Sidebar animation='uncover' width='wide' visible={this.visible} style={{ backgroundColor: '#1b1c1d', overflowX: 'hidden' }}>

          {this.fetching ? <Loader /> : <SidebarPlaylist hub={this.props.location.state.hub} />}

          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <Link to='/' style={{ color: 'white' }}>
              <strong>Back</strong>
            </Link>
          </div>

        </Sidebar>
        <Sidebar.Pusher as={Grid} padded style={{backgroundImage: 'url(assets/img/1510335890477.jpg)'}}>

          {/* Main view with player */}
          <Grid.Row>
            <Grid.Column stretched floated='left' width={1} verticalAlign='middle'>
              <span onClick={this.handleToggleClick.bind(this)} style={togglerStyle}>  &lt; </span>
            </Grid.Column>
            <Grid.Column width={15} textAlign='center' verticalAlign='bottom'>
              <audio id='audioPlayer' onEnded={this.onEnded.bind(this)} controls />
            </Grid.Column>
          </Grid.Row>

        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

export default Player
