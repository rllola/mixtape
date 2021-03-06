import React, { Component } from 'react'
import { Image, Dimmer, Button, Dropdown, Divider } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react'

import EditSong from './EditSong'
import DeleteSong from './DeleteSong'
import Constants from '../../../../utils/constants'
import { getUserAddressFromDirectory } from '../../../../utils/utils'
import IconPeer from '../../../../components/IconPeer/'

@inject('site', 'playlist')
@observer
class Thumbnail extends Component {
  constructor (props) {
    super()

    this.state = {
      active: false,
      edit: false,
      delete: false,
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
    this.setState({delete: true})
  }

  handleMuteUserClicked = (event) => {
    event.stopPropagation()
    event.preventDefault()
    let authAddress = this.props.song.directory.split('/').pop()
    let certUserId = this.props.song.cert_user_id
    let reason = 'Muted on Mixtape'

    this.props.site.muteUser(authAddress, certUserId, reason)
      .then((response) => {
          if (response === 'ok') {
            this.props.playlist.fetchSongsByHub(this.props.song.site)
          }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  closeEdit = (event) => {
    this.setState({edit: false})
  }

  closeDelete = (event) => {
    this.setState({delete: false})
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
      <span
        onMouseEnter={(event) => {event.target.style.backgroundColor = 'rgba(0,0,0,0.8)'; event.target.style.color = 'white' }}
        onMouseLeave={(event) => {event.target.style.backgroundColor = 'rgba(0,0,0,0.2)'; event.target.style.color = 'lightGray' }}
        onClick={(event) => {event.stopPropagation(); event.preventDefault();}}
        style={{ color: 'lightGray', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '30px', position: 'absolute', top: '12px', right: '8px', padding: '6px 8px'}}>
        <IconPeer/>{this.props.fileInfo.peer} |
        <Dropdown text='⋮' icon={false} direction='left'>
          { getUserAddressFromDirectory(this.props.song.directory) === this.props.site.siteInfo.auth_address
           ? (<Dropdown.Menu>
            {/*<Dropdown.Item text='Mute user' onClick={this.handleMuteUserClicked} />
            <Dropdown.Item text='Skip' onClick={null} />
              <Dropdown.Divider />*/}
              <Dropdown.Item text='Edit' onClick={this.handleEditClicked} />
              <Dropdown.Item text='Delete' onClick={this.handleDeleteClicked} />
              </Dropdown.Menu>)
             : (<Dropdown.Menu>
               <Dropdown.Item text='Mute user' onClick={this.handleMuteUserClicked} />
               {/*<Dropdown.Item text='Skip' onClick={null} />*/}
               <Dropdown.Divider />
               <Dropdown.Item style={{ color: 'DarkGray'}} text={'Downloaded : ' + (this.props.fileInfo.downloaded_percent || 0) + '%'} />
               </Dropdown.Menu>
             ) }
        </Dropdown>
      </span>
      <br />
      <br />
      <br />
      <br />
      {this.props.song.artist + ' - ' + this.props.song.title}
      <br />
      <br />
    </div>)

    let showDimmer = active || (this.props.playlist.play.json_id === this.props.song.json_id && this.props.playlist.play.song_id === this.props.song.song_id)

    return (
      <div>
        <Dimmer.Dimmable
          as={Image}
          onMouseEnter={this.handleShow}
          onMouseLeave={this.handleHide}
          onClick={() => {this.props.playlist.playSong(this.props.index)}}>
          <Dimmer style={{ cursor: 'pointer' }} active={showDimmer} content={content} />
          <Image
            onError={this.handleErrorThumbnail}
            style={{ width: '175px', height: '141px' }}
            src={this.props.song.thumbnail_file_name && !errorThumbnail
              ? '/' + Constants.APP_ID + '/merged-Mixtape/' + this.props.song.site + '/' + this.props.song.directory + '/' + this.props.song.thumbnail_file_name
              : 'assets/img/thumbnail.png'} />
        </Dimmer.Dimmable>
        {/* TODO: The modals should not be here ! It is getting repeated several time... */}
        <EditSong open={this.state.edit} close={this.closeEdit} song={this.props.song} />
        <DeleteSong open={this.state.delete} close={this.closeDelete} song={this.props.song} />
      </div>
    )
  }
}

export default Thumbnail
