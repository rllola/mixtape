import React, { Component } from 'react'
import {
  Form,
  Loader,
  Image,
  Modal,
  Grid,
  Dimmer,
  Message
} from 'semantic-ui-react'
import { inject } from 'mobx-react'

@inject('playlist')
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
      srcThumbnail: null,
      isUploading: false,
      active: false,
      error: null
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
    if (event.target.files[0].size < 1024 * 1024) {
      this.setState({thumbnailFile: event.target.files[0], srcThumbnail: URL.createObjectURL(event.target.files[0]), error: null})
    } else {
      this.setState({ error: 'Thumbnail file should be smaller than 1MB.' })
    }
  }

  handleSubmit (event) {
    event.preventDefault()
    this.setState({isUploading: true})
    this.props.playlist.registerSong(this.props.hub, this.state.artist, this.state.title, this.state.file, this.state.thumbnailFile, () => {
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
        : <Modal.Content>
          {this.state.error ? <Message content={this.state.error} negative /> : null}
          <Grid>
            <Grid.Row>
              <Grid.Column width={5}>
                {/* Select thumbnail */}
                <Dimmer.Dimmable
                  dimmed={active}
                  style={{ width: '240px', height: '196px' }}
                  onMouseLeave={this.handleHide}
                  onMouseEnter={this.handleShow} >

                  <Dimmer active={active} content={content} />
                  <Image
                    id='thumbnail'
                    style={{ width: '240px', height: '196px' }}
                    src={this.state.srcThumbnail || 'assets/img/thumbnail.png'} />

                </Dimmer.Dimmable>
                <small>Click to select a thumbnail for your song (240x196).</small>
              </Grid.Column>
              <Grid.Column width={11}>
                <Form id='uploadForm' onSubmit={this.handleSubmit}>
                  <Form.Field>
                    <input id='fileSelector' type='file' accept='.jpg,.png' style={{ display: 'none' }} value={this.state.thumbnail} onChange={this.handleThumbnailChange} />
                    <Form.Input label='Artist' type='text' value={this.state.artist} onChange={this.handleArtistChange} />
                    <Form.Input label='Title' type='text' value={this.state.title} onChange={this.handleTitleChange} />
                    <input label='File' type='file' accept='audio/*' onChange={this.handleFileChange} />
                  </Form.Field>
                  <Form.Button>Submit</Form.Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
    )
  }
}

export default UploadForm
