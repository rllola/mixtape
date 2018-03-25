import React, { Component } from 'react'
import {
  Modal
} from 'semantic-ui-react'
import { inject } from 'mobx-react'

@inject('playlist')
class EditSong extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <Modal open={this.props.open} onClose={this.props.close}>
        <Modal.Header>Edit song</Modal.Header>
        <Modal.Content>
        </Modal.Content>
      </Modal>
    )
  }
}

export default EditSong
