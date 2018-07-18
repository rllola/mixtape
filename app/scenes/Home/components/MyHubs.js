import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { Card, Button, Grid } from 'semantic-ui-react'
import moment from 'moment'

import EditMenu from './EditMenu'

const MAX_HUBS_SHOWN = 9

@inject('site')
@observer
class MyHubs extends Component {
  render () {
    return (
      <Grid>
        <Grid.Row>
          <Card.Group>
            { this.props.site.hubs.slice(0, MAX_HUBS_SHOWN).map((value) => {
              return (
                <Card
                  key={value[0]}
                  link
                  as={Link}
                  to={{
                    pathname: '/playlist/' + value[0],
                    state: { hub: value[1] }
                  }}>
                    <Card.Content>
                      <Card.Header>
                        {value[1].content.title}
                        {/* Need to be in container component...*/}
                        <EditMenu hubInfo={value[1]}
                          isFollowing={this.props.site.feeds[value[0]]}
                          followFeed={() => {this.props.site.followFeed(value[0])}}
                          unfollowFeed={() => {this.props.site.unfollowFeed(value[0])}}
                          isSupporting={value[1].settings.autodownloadoptional}
                          supportPlaylist={() => {this.props.site.supportHub(value[0], value[1].content.title)}}
                          unsupportPlaylist={() => {this.props.site.unsupportHub(value[0])}} />
                      </Card.Header>
                      <Card.Meta>{moment(value[1].content.modified, 'X').fromNow()}</Card.Meta>
                      <Card.Description>
                        {value[1].content.description}
                      </Card.Description>
                    </Card.Content>
                  </Card>
              )
            })
          }
          </Card.Group>
        </Grid.Row>
        <Grid.Row centered>
          { this.props.site.hubs.length > MAX_HUBS_SHOWN ? <Button basic as={Link} to='/playlists' color='blue'>See all</Button> : null }
        </Grid.Row>
      </Grid>
    )
  }
}

export default MyHubs
