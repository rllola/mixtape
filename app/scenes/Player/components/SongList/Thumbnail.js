import React, { Component } from 'react'
import { Image, Dimmer } from 'semantic-ui-react'
import { inject } from 'mobx-react'

import Constants from '../../../../utils/constants'

@inject('playlist')
class Thumbnail extends Component {
  constructor () {
    super()

    this.state = {
      active: false
    }
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

    const content =
    (<div style={contentStyle}>
      {this.props.song.artist + ' - ' + this.props.song.title}
      <br />
      <br />
      { this.props.fileInfo.downloaded_percent || 0 }%
    </div>)

    return (
      <Dimmer.Dimmable
        as={Image}
        dimmed={active}
        onMouseEnter={this.handleShow}
        onMouseLeave={this.handleHide}
        onClick={() => { this.props.playlist.playSong(this.props.index) }}>
          <Dimmer style={{ cursor: 'pointer' }} active={active} content={content} />
          <Image
            style={{ width: '175px', height: '141px' }}
            src={this.props.song.thumbnail_file_name
              ? '/' + Constants.APP_ID + '/merged-Mixtape/' + this.props.song.site + '/' + this.props.song.directory + '/' + this.props.song.thumbnail_file_name
              : 'assets/img/thumbnail.png'} />
        </Dimmer.Dimmable>
    )
  }
}

export default Thumbnail
