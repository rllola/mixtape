import React, { Component } from 'react'
import { Form, Loader, Image, Modal, Container, Dimmer } from 'semantic-ui-react'
import { inject } from 'mobx-react'

@inject('site')
class UploadForm extends Component {
  constructor (props) {
    super(props)

    this.handleFileChange = this.handleFileChange.bind(this)
    this.handleArtistChange = this.handleArtistChange.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.state = {
      artist: '',
      title: '',
      srcThumbnail: null ,
      isUploading: false,
      active: false
    }
  }

  handleShow = () => this.setState({ active: true })

  handleHide = () => this.setState({ active: false })

  handleFileChange (event) {
    this.setState({file: event.target.files[0]})
  }

  handleArtistChange (event) {
    this.setState({artist: event.target.value})
  }

  handleTitleChange (event) {
    this.setState({title: event.target.value})
  }

  handleThumbnailChange = (event) => {
    this.setState({thumbnailFile: event.target.files[0], srcThumbnail: URL.createObjectURL(event.target.files[0])})
  }

  handleSubmit (event) {
    event.preventDefault()
    this.setState({isUploading: true})
    this.props.site.registerSong(this.props.playlist, this.state.artist, this.state.title, this.state.file, this.state.thumbnailFile, () => {
      this.props.postUploadAction()
    })
    this.setState({ title: '' })
    this.setState({ artist: '' })
  }

  render () {
    const { active, isUploading } = this.state

    const content = (
      <div>
        <label htmlFor='fileSelector'>
          <h2 style={{ width: '100%' }}>Click to select an image</h2>
        </label>
      </div>
    )

    return (
      isUploading
      ? <Loader size='massive'>Uploading file...</Loader>
      : <Modal.Content image>

        {/* Select thumbnail */}
        <Dimmer.Dimmable
          as={Image}
          dimmed={active}
          dimmer={{ active, content }}
          wrapped
          onMouseLeave={this.handleHide}
          onMouseEnter={this.handleShow}
          size='large'
          src={this.state.srcThumbnail || 'assets/img/thumbnail.png'} />

       {/* The rest of the form */}
       <Modal.Description>
        <Container>
          <Form id='uploadForm' onSubmit={this.handleSubmit}>
            <Form.Field>
              <Form.Input id='fileSelector' type='file' style={{display:'none'}} value={this.state.thumbnail} onChange={this.handleThumbnailChange} />
              <Form.Input label='Artist' type='text' value={this.state.artist} onChange={this.handleArtistChange} />
              <Form.Input label='Title' type='text' value={this.state.title} onChange={this.handleTitleChange} />
              <Form.Input label='File' type='file' onChange={this.handleFileChange} />
            </Form.Field>
            <Form.Button>Submit</Form.Button>
          </Form>
        </Container>
        </Modal.Description>
      </Modal.Content>
    )
  }
}

export default UploadForm
