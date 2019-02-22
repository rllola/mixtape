import React, { Component } from 'react'
import { Image, Dimmer, Button, Dropdown, Divider } from 'semantic-ui-react'
import { inject } from 'mobx-react'

import EditSong from './EditSong'
import Constants from '../../../../utils/constants'
import { getUserAddressFromDirectory } from '../../../../utils/utils'
import IconPeer from '../../../../components/IconPeer/'

@inject('site', 'playlist')
class Thumbnail extends Component {
  constructor () {
    super()

    this.state = {
      active: false,
      edit: false,
      errorThumbnail: false
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
    this.props.playlist.deleteSong(this.props.song.song_id, this.props.song.site, () => {
      console.log('Done !')
    })
  }

  closeEdit = (event) => {
    this.setState({edit: false})
  }

  handleErrorThumbnail = () => {
    this.setState({errorThumbnail: true})
  }

  render () {
    const { active, errorThumbnail, openDropdown } = this.state
    const contentStyle = {
      WebkitUserSelect: 'none', /* Safari */
      MozUserSelect: 'none', /* Firefox */
      MsUserSelect: 'none', /* IE10+/Edge */
      userSelect: 'none' /* Standard */
    }

    const content =
    (<div style={contentStyle}>
      <span onClick={(event) => {event.stopPropagation(); event.preventDefault();}} style={{ color: 'lightGray', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '30px', position: 'absolute', top: '12px', right: '8px', padding: '6px 8px'}}>
        <IconPeer/>{this.props.fileInfo.peer} |
        <Dropdown text='⋮' icon={false} direction='left'>
          <Dropdown.Menu>
            <Dropdown.Item text='Mute user' onClick={null} />
            <Dropdown.Item text='Skip' onClick={null} />
            <Dropdown.Divider />
            <Dropdown.Item text='Edit' onClick={this.handleEditClicked} />
            <Dropdown.Item text='Delete' onClick={this.handleDeleteClicked} />
          </Dropdown.Menu>
        </Dropdown>
      </span>
      <br />
      <br />
      <br />
      <br />
      {this.props.song.artist + ' - ' + this.props.song.title}
      <br />
      <br />
      { this.props.fileInfo.downloaded_percent || 0 }%
      <br />
      {/*getUserAddressFromDirectory(this.props.song.directory) === this.props.site.siteInfo.auth_address
        ? <Button.Group>
          <Button onClick={this.handleEditClicked} inverted content='Edit' />
          <Button onClick={this.handleDeleteClicked} inverted color='red' content='Delete' />
        </Button.Group>
        : null*/}
    </div>)

    return (
      <div>
        <Dimmer.Dimmable
          as={Image}
          onMouseEnter={this.handleShow}
          onMouseLeave={this.handleHide}
          onClick={() => {this.props.playlist.playSong(this.props.index)}}>
          <Dimmer style={{ cursor: 'pointer' }} active={active} content={content} />
          <Image
            onError={this.handleErrorThumbnail}
            style={{ width: '175px', height: '141px' }}
            src={this.props.song.thumbnail_file_name && !errorThumbnail
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
