import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { Card, Button, Grid } from 'semantic-ui-react'
import moment from 'moment'

const MAX_HUBS_SHOWN = 9

@inject('site')
@observer
class MyHubs extends Component {
  componentWillMount () {
    this.props.site.fetchHubs()
  }

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
                  to={'/playlist/' + value[0]}
                  header={value[1].content.title}
                  meta={moment(value[1].content.modified, 'X').fromNow()}
                  description={value[1].content.description} />
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
