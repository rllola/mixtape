import React, { Component } from 'react'
import { Segment, Header, Modal, Button, Grid } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'

import Upload from './Upload/'
import SongList from './SongList/'
import SupportOptionalFileButton from './SupportOptionalFileButton'
import SelectUser from '../../../components/SelectUser'
import FollowFeed from './FollowFeed/'

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

        // Check direct permission
        permissions.forEach((element) => {
          if (this.props.site.siteInfo.cert_user_id === element[0]) {
            this.hasPermission = true
          }
        })

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
          <Grid>
            <Grid.Column width={12} >
              <Header inverted as='h1'>
                { title }
                <FollowFeed hub={this.props.hub.address} style={{marginLeft: '10px', verticalAlign: '20%'}} />
              </Header>
            </Grid.Column>
            <Grid.Column width={4}>
              <SupportOptionalFileButton hub={this.props.hub.address} title={title} />
            </Grid.Column>
          </Grid>
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
            ? <Upload playlist={this.props.hub.address} />
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
