import React, { Component } from 'react'
import { Form, Modal, Button } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

@inject('site')
@observer
class EditModal extends Component {
  constructor () {
    super()

    this.state = {
      title: '',
      description: '',
    }
  }

  handleTitleChange (event) {
    this.setState({title: event.target.value})
  }

  handleDescriptionChange (event) {
    this.setState({description: event.target.value})
  }


  handleDiscardClick () {
    this.props.close()
  }

  handleSaveClick () {
    this.props.site.editMixtape(this.props.hub, this.state.title, this.state.description)
      .then((res) => {
        console.log(res)
        this.props.close()
      })
      .catch(function (err) {
        console.error(err)
        console.log('Something bad happened')
      })
  }

  render () {
    return (
      <Modal open={this.props.open} centered={false}>
        <Modal.Header>Edit Playlist</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Form.Field>
                <label>Mixtape name</label>
                <input value={this.state.title} onChange={this.handleTitleChange.bind(this)} placeholder='Mixtape name' />
              </Form.Field>
              <Form.Field>
                <Form.TextArea value={this.state.description} onChange={this.handleDescriptionChange.bind(this)} label='Description' placeholder='What kind of vibe' />
              </Form.Field>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='red' inverted content='Discard' onClick={this.handleDiscardClick.bind(this)} />
          <Button color='green' inverted content='Save' onClick={this.handleSaveClick.bind(this)} />
        </Modal.Actions>
      </Modal>
    )
  }

}

export default EditModal
