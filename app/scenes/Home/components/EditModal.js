import React, { Component } from 'react'
import { Form, Modal, Button, Table } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'

@inject('site', 'playlist')
@observer
class EditModal extends Component {
  constructor () {
    super()

    this.state = {
      title: null,
      description: null,
      permissions: [],
      permissionRules: []
    }
  }

  componentDidMount () {
    this.props.playlist.getHubRules(this.props.hub.address)
      .then((rules) => {
        rules = JSON.parse(rules)
        let permissions = Object.entries(rules.user_contents.permissions)
        let permissionRules = Object.entries(rules.user_contents.permission_rules)

        this.setState({permissions: permissions, permissionRules: permissionRules})
      })
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
    this.props.site.editMixtape(this.props.hub.address, this.state.title, this.state.description)
      .then((res) => {
        this.props.close()
      })
      .catch((err) => {
        // Need a modal to inform on the error
        console.error(err)
        this.props.close()
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
                <input value={this.state.title === null ? this.props.hub.content.title : this.state.title} onChange={this.handleTitleChange.bind(this)} placeholder='Mixtape name' />
              </Form.Field>
              <Form.Field>
                <Form.TextArea value={this.state.description === null ? this.props.hub.content.description : this.state.description} onChange={this.handleDescriptionChange.bind(this)} label='Description' placeholder='What kind of vibe' />
              </Form.Field>
              <Form.Field>
                <label>Permissions</label>
                <Table basic='very'>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Address/Id</Table.HeaderCell>
                      <Table.HeaderCell>Max Size</Table.HeaderCell>
                      <Table.HeaderCell>Max Optional Size</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {this.state.permissions.map((element, index) => {
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>{element[0]}</Table.Cell>
                          <Table.Cell>{element[1].max_size}</Table.Cell>
                          <Table.Cell>{element[1].max_size_optional || 'N/A' }</Table.Cell>
                        </Table.Row>
                      )
                    })}
                  </Table.Body>
                </Table>
              </Form.Field>
              <Form.Field>
                <label>Permissions Rules</label>
                <Table basic='very'>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Id certificate</Table.HeaderCell>
                      <Table.HeaderCell>Max Size</Table.HeaderCell>
                      <Table.HeaderCell>Max Optional Size</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {this.state.permissionRules.map((element, index) => {
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>{element[0]}</Table.Cell>
                          <Table.Cell>{element[1].max_size}</Table.Cell>
                          <Table.Cell>{element[1].max_size_optional || 'N/A' }</Table.Cell>
                        </Table.Row>
                      )
                    })}
                  </Table.Body>
                </Table>
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
