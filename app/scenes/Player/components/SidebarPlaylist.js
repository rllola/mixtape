import React, { Component } from 'react'
import { Segment, Header, Modal, Button, Image } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import { Link } from 'react-router-dom'

import Upload from './Upload/'
import SongList from './SongList/'
import SelectUser from '../../../components/SelectUser'

@inject('site', 'playlist')
@observer
class SidebarPlaylist extends Component {
  @observable open = false
  @observable hasPermission = false

  componentDidMount () {
    this.props.playlist.getHubRules('merged-Mixtape/' + this.props.hub.address + '/data/users/' + this.props.site.authAddress + '/content.json')
      .then((res) => {
        if (res.max_size !== undefined) {
          this.hasPermission = true
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  show () {
    this.open = true
  }

  close () {
    this.open = false
  }

  render () {
    const { title, description } = this.props.hub.content

    return (
      <div>
        {/* Sidebar header */}
        <Segment inverted basic>
          <Header as='h1'>{ title }</Header>
          <br />
          <p>{ description }</p>
          <br />
          <br />
          { this.hasPermission ? <Button onClick={this.show.bind(this)} fluid inverted basic>Add</Button> : null}
        </Segment>

        {/* Modal for uploading song */}
        <Modal dimmer='blurring' open={this.open} onClose={this.close.bind(this)}>
          <Modal.Header>Upload Form</Modal.Header>
          {this.props.site.isConnected
            ? <Upload playlist={this.props.hub.address} postUploadAction={() => { this.props.playlist.fetchSongsByHub(this.props.hub.address) }} />
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
