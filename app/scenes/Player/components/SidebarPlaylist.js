import React, { Component } from 'react'
import { Segment, Header, Modal, Button } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'

import Upload from './Upload/'
import SongList from './SongList/'
import SelectUser from '../../../components/SelectUser'

@inject('site', 'playlist')
@observer
class SidebarPlaylist extends Component {
  @observable open = false
  @observable hasPermission = false

  componentDidMount () {
    this.props.playlist.getHubRules(this.props.hub.address)
      .then((res) => {
        let response = JSON.parse(res)
        let permissions = Object.entries(response.user_contents.permissions)

        console.log(this.props.site.siteInfo.cert_user_id)

        // Check direct permission
        permissions.forEach((element) => {
          if (this.props.site.siteInfo.cert_user_id === element[0]) {
            this.hasPermission = true
          }
        })

        console.log(this.hasPermission)

        // Check permissions_rules
        if (!this.hasPermission) {
          let permissionRules = Object.entries(response.user_contents.permission_rules)
          permissionRules.forEach((element) => {
            let certProvider = this.props.site.siteInfo.cert_user_id.split('@')[1]
            if (element[0].indexOf(certProvider) > 0 || element[0] === '.*') {
              this.hasPermission = true
            }
          })
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
