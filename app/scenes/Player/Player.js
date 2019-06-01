import React, { Component } from 'react'
import { Sidebar, Grid, Loader, Header } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'

import SidebarPlaylist from './components/SidebarPlaylist'
import BackButton from '../../components/BackButton'

import Constants from '../../utils/constants'

@inject('site', 'playlist')
@observer
class Player extends Component {
  @observable visible = true
  @observable fetching = true
  @observable hubDetail

  constructor (props) {
    super(props)

    if (this.props.location.state) {
      this.hubDetail = this.props.location.state.hub
    }

  }

  componentDidMount () {
    this.hub = this.props.match.params.hub
    this.player = document.getElementById('audioPlayer')

    this.props.playlist.on('songChanged', this._loadAndPlay)

    this.props.site.fetchHubs()
      .then(() => {
        let hub = this.props.site.hubs.filter((element) => {
          return element[0] === this.hub
        })
        if (hub.length > 0) {
          // Need to be done before loading component
          this.props.playlist.fetchSongsByHub(this.hub)
            .then(() => {
              if (this.props.playlist.src) {
                this.player.src = this.props.playlist.src
              }

              // hacky
              if (!this.hubDetail) {
                this.props.site.hubs.forEach((element) => {
                  if (element[0] === this.hub) {
                    this.hubDetail = element[1]
                  }
                })

              }
              this.fetching = false
            })
        } else {
          this.props.site.mergerSiteAdd([this.hub])
            .then((response) => {
              this.props.site.showWrapperNotification('The new hub will be added and you will be redirected to the main page in 6 sec.')
              setTimeout(function () {
                window.location.href = '/' + Constants.APP_ID
              }, 6000)
            })
        }
      })
  }

  componentWillUnmount () {
    this.props.playlist.removeListener('songChanged', this._loadAndPlay)
    this.player = null
  }

  onEnded (event) {
    this.props.playlist.playNextSong()
    if (this.props.playlist.index) {
      this._loadAndPlay()
    }
  }

  _loadAndPlay = () => {
    this.player.src = this.props.playlist.src
    this.player.load()
    this.player.play()
  }

  pause = () => {
    if (this.player.paused) {
      this.player.play()
    } else {
      this.player.pause()
    }
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
        <Sidebar animation='uncover' width='wide' visible={this.visible} style={{ backgroundColor: '#1b1c1d', overflow: 'hidden !important' }}>

          {this.fetching ? <Loader /> : <SidebarPlaylist hub={this.hubDetail} />}

          <BackButton />

        </Sidebar>
        <Sidebar.Pusher as={Grid} padded style={{backgroundImage: 'url(assets/img/pineapples.jpg)', backgroundSize: 'cover'}}>

          {/* Main view with player */}
          <Grid.Row>
            <Grid.Column stretched floated='left' width={1} verticalAlign='middle'>
              <span onClick={this.handleToggleClick.bind(this)} style={togglerStyle}>  &lt; </span>
            </Grid.Column>
            <Grid.Column width={15} textAlign='center' style={{ height: '100%'}} onClick={this.pause}>
              <audio id='audioPlayer' onEnded={this.onEnded.bind(this)} controls />
              <Header as='h1' style={{ fontWeight:'normal',transform: 'rotate(-12deg)', color: 'white', fontSize: '15rem', marginTop: '30vh', textShadow: '1px 1px 2px rgba(0,0,0,0.4)', fontFamily: 'Mr Dafoe' }}>Mixtape*</Header>
            </Grid.Column>
          </Grid.Row>

        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

export default Player
