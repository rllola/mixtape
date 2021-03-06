import React, { Component } from 'react'
import {
  Form,
  Image,
  Modal,
  Grid,
  Dimmer,
  Message,
  Loader
} from 'semantic-ui-react'
import Constants from '../../../../utils/constants'
import { inject } from 'mobx-react'

@inject('playlist')
class EditSong extends Component {
  constructor (props) {
    super()

    this.state = {
      artist: props.song.artist,
      title: props.song.title,
      srcThumbnail: '/' + Constants.APP_ID + '/merged-Mixtape/' + props.song.site + '/' + props.song.directory + '/' + props.song.thumbnail_file_name,
      isUploading: false,
      active: false,
      error: null
    }
  }

  handleShow = () => this.setState({ active: true })
  handleHide = () => this.setState({ active: false })
  handleArtistChange = (event) => this.setState({artist: event.target.value})
  handleTitleChange = (event) => this.setState({title: event.target.value})

  handleThumbnailChange = (event) => {
    if (event.target.files[0].size < 1024 * 1024) {
      this.setState({thumbnailFile: event.target.files[0], srcThumbnail: URL.createObjectURL(event.target.files[0]), error: null})
    } else {
      this.setState({ error: 'Thumbnail file should be smaller than 1MB.' })
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.setState({isUploading: true})
    this.props.playlist.editSong(this.props.song.song_id, this.props.song.site, this.state.artist, this.state.title, this.state.thumbnailFile, () => {
      this.props.close()
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

    return (<Modal open={this.props.open} onClose={this.props.close}>
      <Modal.Header>Edit song</Modal.Header>
      {isUploading
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
                  </Form.Field>
                  <Form.Button>Submit</Form.Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>}
    </Modal>)
  }
}

export default EditSong
