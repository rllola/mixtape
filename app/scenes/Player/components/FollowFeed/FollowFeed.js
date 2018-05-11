import React, { Component } from 'react'
import { Popup } from 'semantic-ui-react'
import IconFeed from '../../../../components/IconFeed/'
import { inject, observer } from 'mobx-react'

@inject('site')
@observer
class FollowFeed extends Component {
  state = {following: false}

  componentDidMount () {
    this.props.site.feedListFollow()
      .then((res) => {
        console.log(res)
        if (res.Posts) {
          this.setState({following: true})
        }
      })
  }

  handleClik = (event) => {
    if (!this.state.following) {
      this.props.site.followFeed()
        .then(() => {
          this.setState({following: true})
        })
    } else {
      this.props.site.unfollowFeed()
        .then((res) => {
          console.log(res)
          this.setState({following: false})
        })
    }
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
