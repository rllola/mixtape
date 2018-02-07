import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, Grid, Button } from 'semantic-ui-react'
import publicAddress from '../../../data'

const MAX_PUBLIC_HUBS_SHOWN = 9

class PublicHubs extends Component {
  render () {
    return (
      <Grid>
        <Grid.Row>
          <Card.Group>
            { publicAddress.slice(0, MAX_PUBLIC_HUBS_SHOWN).map((value) => {
              return (
                <Card
                  key={value.hub_address}
                  link
                  href={'http://127.0.0.1:43110/' + value.hub_address}
                  header={value.title}
                  meta={value.creator}
                  description={value.description} />
              )
            })
          }
          </Card.Group>
        </Grid.Row>
        <Grid.Row centered>
          { publicAddress.length > MAX_PUBLIC_HUBS_SHOWN ? <Button basic as={Link} to='/public' color='blue'>See all</Button> : null }
        </Grid.Row>
      </Grid>
    )
  }
}

export default PublicHubs
