import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import { inject, observer } from 'mobx-react'

@inject('site')
@observer
class SelectUser extends Component {
  handleClick (event) {
    event.preventDefault()
    this.props.site.selectUser()
  }

  render () {
    return (
      <Button {...this.props} onClick={this.handleClick.bind(this)}>
      { this.props.site.isConnected ? this.props.site.username : 'Select User' }
      </Button>
    )
  }
}

export default SelectUser
