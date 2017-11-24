import React, { Component } from 'react'
import { Image, Dimmer } from 'semantic-ui-react'
import { inject } from 'mobx-react'

@inject('playlist')
class Thumbnail extends Component {
  constructor () {
    super()

    this.state = {active: false}
  }

  handleShow = () => this.setState({ active: true })
  handleHide = () => this.setState({ active: false })

  render () {
    const { active } = this.state
    const contentStyle = {
      WebkitUserSelect: 'none', /* Safari */
      MozUserSelect: 'none', /* Firefox */
      MsUserSelect: 'none', /* IE10+/Edge */
      userSelect: 'none' /* Standard */
    }
    const content = (<div style={contentStyle}>{this.props.song.artist + ' - ' + this.props.song.title}</div>)

    return (
      <Dimmer.Dimmable
        as={Image}
        dimmed={active}
        dimmer={{ active, content }}
        onMouseEnter={this.handleShow}
        onMouseLeave={this.handleHide}
        onClick={() => { this.props.playlist.playSong(this.props.song.song_id) }}
        style={{cursor: 'pointer'}}
        src='assets/img/thumbnail.png'
      />
    )
  }
}

export default Thumbnail
