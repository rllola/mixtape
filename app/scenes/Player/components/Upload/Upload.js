import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'

import UploadForm from './UploadForm'

class Upload extends Component {
  constructor (props) {
    super()

    this.state = {
      uploaded: false
    }
  }

  handlePostUpload () {
    this.setState({uploaded: true})
    this.props.postUploadAction()
  }

  render () {
    return (
      this.state.uploaded
      ? <Modal.Content><h1>Thank you for uploading</h1></Modal.Content>
      : <UploadForm playlist={this.props.playlist} postUploadAction={this.handlePostUpload.bind(this)} />
    )
  }
}

export default Upload
