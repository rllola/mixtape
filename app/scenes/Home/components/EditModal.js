import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import { observer } from 'mobx-react'

@observer
class EditModal extends Component {
  render () {
    return (
      <Modal open={this.props.open} centered={false}>
        <Modal.Header>Edit Playlist</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>Form to edit the playlist !!!</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' inverted content='Discard' onClick={this.props.close} />
          <Button color='green' inverted content='Save' onClick={this.props.close} />
        </Modal.Actions>
      </Modal>
    )
  }

}

export default EditModal
