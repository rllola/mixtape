import React, { Component } from 'react'
import { Container, Form, Loader } from 'semantic-ui-react'
import { inject } from 'mobx-react'

@inject('site')
class Upload extends Component {
  constructor (props) {
    super(props)

    this.handleFileChange = this.handleFileChange.bind(this)
    this.handleArtistChange = this.handleArtistChange.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      artist: '',
      title: '',
      isUploading: false,
      uploaded: false
    }
  }

  handleFileChange (event) {
    this.setState({file: event.target.files[0]})
  }

  handleArtistChange (event) {
    this.setState({artist: event.target.value})
  }

  handleTitleChange (event) {
    this.setState({title: event.target.value})
  }

  handleSubmit (event) {
    event.preventDefault()
    this.setState({isUploading: true})
    this.props.site.registerSong(this.props.playlist, this.state.artist, this.state.title, this.state.file, () => {
      this.setState({isUploading: false, uploaded: true})
      this.props.postUploadAction()
    })
    this.setState({ title: '' })
    this.setState({ artist: '' })
  }

  render () {
    return (
      <Container>
      { this.state.isUploading
        ? <Loader size='massive'>Uploading file...</Loader>
        : (this.state.uploaded
          ? <h1>Thank you for uploading</h1>
          : <Form id='uploadForm' onSubmit={this.handleSubmit}>
          <Form.Field>
            <Form.Input label='Artist' type='text' value={this.state.artist} onChange={this.handleArtistChange} />
            <Form.Input label='Title' type='text' value={this.state.title} onChange={this.handleTitleChange} />
            <Form.Input label='File' type='file' onChange={this.handleFileChange} />
          </Form.Field>
          <Form.Button>Submit</Form.Button>
        </Form>)
      }
      </Container>
    )
  }
}

export default Upload
