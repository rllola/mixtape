import React, { Component } from 'react'
import { Popup } from 'semantic-ui-react'
import IconFeed from '../../../../components/IconFeed/'

class FollowFeed extends Component {
  state = {following: false}

  handleClik = (event) => {
    this.setState({following: !this.state.following})
  }

  render () {
    var { style } = this.props

    return (
      <Popup
        trigger={
          <span onClick={this.handleClik} style={{cursor: 'pointer'}}>
            <IconFeed style={style} following={this.state.following} />
          </span>
        }
        content='Add to your newsfeed'
        on='hover'
        position='bottom left' />
    )
  }
}

export default FollowFeed
