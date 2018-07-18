import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { Popup, Checkbox } from 'semantic-ui-react'
import './ToggleButton.css'

@inject('playlist', 'site')
class SupportOptionalFileButton extends Component {
  constructor (props) {
    super(props)

    this.state = {
      checked: props.hub.settings.autodownloadoptional
    }
  }

  onChange = () => {
    if (this.state.checked) {
      // Don't support the hub anymore
      this.props.site.unsupportHub(this.props.hub.address)
        .then(() => {
          this.setState({checked: false})
        })
    } else {
      // Support the hub !
      this.props.site.supportHub(this.props.hub.address)
      .then(() => {
        this.setState({checked: true})
      })
    }
  }

  render () {
    return (
      <Popup
        trigger={<Checkbox toggle style={this.props.style} checked={this.state.checked} onChange={this.onChange} />}
        content='Support this playlist by automatically downloading every songs.'
        on='hover'
        position='bottom right' />
    )
  }
}

export default SupportOptionalFileButton
