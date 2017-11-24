import React, { Component } from 'react'
import { Segment, Header, Modal, Button, Image } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'

import Upload from './Upload'
import SongList from './SongList/'
import SelectUser from '../../../components/SelectUser'

@inject('site', 'playlist')
@observer
class SidebarPlaylist extends Component {
  @observable open = false

  show () {
    this.open = true
  }

  close () {
    this.open = false
  }

  render () {
    return (
      <div>
        {/* Sidebar header */}
        <Segment inverted basic>
          <Header as='h1'>Playlist Title</Header>
          <br />
          <p>Description</p>
          <br />
          <br />
          <Button onClick={this.show.bind(this)} fluid inverted basic>Add</Button>
        </Segment>

        {/* Modal for uploading song */}
        <Modal dimmer='blurring' open={this.open} onClose={this.close.bind(this)}>
          <Modal.Header>Upload Form</Modal.Header>
          {this.props.site.isConnected
            ? <Modal.Content image>
              {/* Select thumbnail */}
              <Image wrapped size='medium' src='assets/img/thumbnail.png' />
              <Modal.Description>
                <Upload playlist={this.props.hub} postUploadAction={() => { this.props.playlist.fetchSongsByHub(this.props.hub) }} />
              </Modal.Description>
            </Modal.Content>
            : <Modal.Content textAlign='center'><SelectUser /></Modal.Content>}
          <Modal.Actions>
            <Button color='black' onClick={this.close.bind(this)}>
              Nope
            </Button>
            {/* <Button positive content='Valid' onClick={this.close.bind(this)} */}
          </Modal.Actions>
        </Modal>

        {/* Song list thumbnails */}
        <SongList songs={this.props.playlist.songs} />
      </div>
    )
  }
}

export default SidebarPlaylist
