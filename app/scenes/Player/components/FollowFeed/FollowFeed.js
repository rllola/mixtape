import React, { Component } from 'react'
import { Popup } from 'semantic-ui-react'
import IconFeed from '../../../../components/IconFeed/'
import { inject, observer } from 'mobx-react'

@inject('site')
@observer
class FollowFeed extends Component {
  componentDidMount () {
    // Need to load this when we enter the site
    this.props.site.feedListFollow()
  }

  handleClik = (event) => {
    if (!this.props.site.feeds[this.props.hub]) {
      this.props.site.followFeed(this.props.hub)
    } else {
      this.props.site.unfollowFeed(this.props.hub)
    }
  }

  render () {
    var { style } = this.props

    return (
      <Popup
        trigger={
          <span onClick={this.handleClik} style={{cursor: 'pointer'}}>
            <IconFeed style={style} following={this.props.site.feeds[this.props.hub]} />
          </span>
        }
        content='Add to your newsfeed'
        on='hover'
        position='bottom left' />
    )
  }
}

export default FollowFeed
