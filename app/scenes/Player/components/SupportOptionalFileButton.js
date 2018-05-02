import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { Popup, Checkbox } from 'semantic-ui-react'
import './ToggleButton.css'

@inject('playlist')
class SupportOptionalFileButton extends Component {
  constructor () {
    super()

    this.state = {
      checked: false
    }
  }

  componentDidMount () {
    this.props.playlist.fetchOptionalHelpList(this.props.hub)
      .then((res) => {
        console.log(Object.entries(res))
        if (Object.entries(res).length > 0) {
          this.setState({checked: true})
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  onChange = () => {
    if (this.state.checked) {
      // Don't support the hub anymore
      this.props.playlist.unsupportHub(this.props.hub)
        .then((res) => {
          console.log(res)
          this.setState({checked: false})
        })
        .catch(() => {
          console.log('Error ! Contact Lola !')
        })
    } else {
      // Support the hub !
      this.props.playlist.supportHub(this.props.hub, this.props.title)
        .then((res) => {
          console.log(res)
          this.setState({checked: true})
        })
        .catch(() => {
          console.log('Error ! Contact Lola !')
        })
    }
  }

  render () {
    return (
      <Popup
        trigger={<Checkbox toggle style={this.props.style} checked={this.state.checked} onChange={this.onChange} />}
        content='Support this playlist by automatically downloading every songs.'
        on='hover'
        position='right' />
    )
  }
}

export default SupportOptionalFileButton
