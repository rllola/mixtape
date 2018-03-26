import React, { Component } from 'react'
import { Image, Dimmer } from 'semantic-ui-react'
import { inject } from 'mobx-react'

import EditSong from './EditSong'
import Constants from '../../../../utils/constants'
import { getUserAddressFromDirectory } from '../../../../utils/utils'

@inject('site','playlist')
class Thumbnail extends Component {
  constructor () {
    super()

    this.state = {
      active: false,
      edit: false
    }
  }

  handleShow = () => this.setState({ active: true })
  handleHide = () => this.setState({ active: false })

  handleEditClicked = (event) => {
    event.stopPropagation()
    event.preventDefault()
    this.setState({edit: true})
  }

  handleDeleteClicked = (event) => {
    event.stopPropagation()
    event.preventDefault()
  }

  closeEdit = (event) => {
    this.setState({edit: false})
  }

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
      <br />
      <br />
      {getUserAddressFromDirectory(this.props.song.directory) === this.props.site.siteInfo.auth_address
        ? <div style={{'textAlign': 'center'}}>
          <button onClick={this.handleEditClicked} className='ui inverted button'>Edit</button><button onClick={this.handleDeleteClicked} className='ui inverted red button'>Delete</button>
        </div>
        : null}
    </div>)

    return (
      <div>
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
        {/* TODO: The modal should not be here ! It is getting repeated several time... */}
        <EditSong open={this.state.edit} close={this.closeEdit} song={this.props.song} />
      </div>
    )
  }
}

export default Thumbnail
