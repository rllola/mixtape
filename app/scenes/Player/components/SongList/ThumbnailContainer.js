import React, { Component } from 'react'
import { inject } from 'mobx-react'

import Thumbnail from './Thumbnail'

@inject('playlist')
class ThumbnailContainer extends Component {
  constructor (props) {
    super()

    this.state = {
      fileInfo: null
    }
  }

  componentDidMount () {
    this.props.playlist.fetchOptionalFileInfo('merged-Mixtape/' + this.props.song.site + '/' + this.props.song.directory + '/' + this.props.song.file_name)
      .then((res) => {
        this.setState({fileInfo: res})
      })
      .catch((err) => {
        console.log(err)
      })
  }

  render () {
    return (
      this.state.fileInfo
        ? <Thumbnail song={this.props.song} fileInfo={this.state.fileInfo} index={this.props.index} />
        : null)
  }
}

export default ThumbnailContainer
