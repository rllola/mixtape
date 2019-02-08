import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { Card, Grid, Button } from 'semantic-ui-react'

const MAX_PUBLIC_HUBS_SHOWN = 9

@inject('site')
@observer
class PublicHubs extends Component {
  render () {
    return (
      <Grid>
        <Grid.Row>
          {
            this.props.site.playlistIndex.length > 0
            ? (<Card.Group>
                { this.props.site.playlistIndex.slice(0, MAX_PUBLIC_HUBS_SHOWN).map((value) => {
                  return (
                    <Card
                      key={value.hub_address}
                      link
                      href={'/' + value.hub_address}
                      header={value.title}
                      meta={value.creator}
                      description={value.description} />
                    )
                  })
                }
              </Card.Group>)
            : <p style={{ color: 'DarkGray'}}>
              Nothing listed yet ? Please check our <a href='/1Nwdm8MooUizdkgaUdAdqqjyK1xXjY57PK'>default playlist index</a>.
              <br/>
              Still not showing ? Try rebuilding the database by pulling the panel on the right --->
          </p>
          }
        </Grid.Row>
        <Grid.Row centered>
          { this.props.site.playlistIndex.length > MAX_PUBLIC_HUBS_SHOWN ? <Button basic as={Link} to='/public' color='blue'>See all</Button> : null }
        </Grid.Row>
      </Grid>
    )
  }
}

export default PublicHubs
