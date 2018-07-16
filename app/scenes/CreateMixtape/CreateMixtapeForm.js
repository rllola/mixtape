import React, { Component } from 'react'
import { Button, Checkbox, Form } from 'semantic-ui-react'
import { inject } from 'mobx-react'

@inject('site')
class CreateMixtapeForm extends Component {
  constructor () {
    super()

    this.state = {
      name: '',
      description: '',
      isPublic: false
    }
  }

  handleNameChange (event) {
    console.log(event.target.value)
    this.setState({name: event.target.value})
  }

  handleDescriptionChange (event) {
    console.log(event.target.value)
    this.setState({description: event.target.value})
  }

  handleIsPublicChange (event) {
    this.setState({isPublic: !this.state.isPublic})
  }

  handleSubmit () {
    console.log('Submit !')
    this.props.site.createMixtape(this.state.name, this.state.description, this.state.isPublic)
      .then(() => {
        console.log('OK')
      })
  }

  render () {
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <Form.Field>
          <label>Name</label>
          <input name='name' value={this.state.name} onChange={this.handleNameChange.bind(this)} placeholder='Mixtape Name' />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <Form.TextArea name='description' value={this.state.description} onChange={this.handleDescriptionChange.bind(this)} placeholder='Dope mixtape description' />
        </Form.Field>
        <Form.Field>
          <Checkbox onChange={this.handleIsPublicChange.bind(this)} checked={this.state.checked} label='Make it public' />
        </Form.Field>
        <Button type='submit'>Submit</Button>
      </Form>
    )
  }
}

export default CreateMixtapeForm
