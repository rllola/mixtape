import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import { inject } from 'mobx-react'

@inject('playlist')
class DeleteSong extends Component {

  handleDeleteClicked = (event) => {
    event.preventDefault()
    this.props.playlist.deleteSong(this.props.song.song_id, this.props.song.site, () => {
      console.log('Done !')
      this.props.close()
    })
  }

  render () {
    return (
      <Modal open={this.props.open} onClose={this.props.close}>
        <Modal.Header>Delete Song</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete <b>{this.props.song.artist} - {this.props.song.title}</b> from this playlist ?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color='black' onClick={this.props.close}>
            Cancel
          </Button>
          <Button basic color='red' onClick={this.handleDeleteClicked}>
            Delete
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default DeleteSong
