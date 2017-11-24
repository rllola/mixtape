import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import {
  Button,
  Container,
  Divider,
  Header,
  Segment
} from 'semantic-ui-react'

import SelectUser from '../../components/SelectUser'
import MyHubs from './components/MyHubs'
import PublicHubs from './components/PublicHubs'

@inject('site')
@observer
class Home extends Component {
  render () {
    return (
      <div>
        <Segment
          inverted
          textAlign='center'
          style={{ minHeight: 700, padding: '1em 0em', backgroundImage: 'url(assets/img/1510335890477.jpg)' }}
          vertical >

          <Container textAlign='right'>
            <SelectUser as='a' inverted />
          </Container>

          <Container text>
            <Header
              as='h1'
              content='Mixtape'
              inverted
              style={{ fontSize: '4em', fontWeight: 'normal', marginBottom: 0, marginTop: '3em' }} />

            <Header
              as='h2'
              content='Share your playlist'
              inverted
              style={{ fontSize: '1.7em', fontWeight: 'normal' }} />
          </Container>
        </Segment>

        <Segment style={{ padding: '8em 0em' }} vertical>
          <Container>
            <Header as='h3' style={{ fontSize: '2em' }}>My Hubs</Header>

            <MyHubs />

            <Divider
              as='h4'
              className='header'
              horizontal
              style={{ margin: '3em 0em' }} />

            <Header as='h3' style={{ fontSize: '2em' }}>Public Hubs</Header>

            <PublicHubs />

          </Container>
        </Segment>

        <Segment inverted vertical style={{ padding: '5em 0em' }}>
          <Container>
            <p>Made with love by Lola</p>
          </Container>
        </Segment>
      </div>
    )
  }
}

export default Home
