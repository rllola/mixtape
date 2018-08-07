import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import {
  Container,
  Divider,
  Header,
  Segment,
  Image,
  Grid,
  Button,
  Modal
} from 'semantic-ui-react'

import SelectUser from '../../components/SelectUser'

import MyHubs from './components/MyHubs'
import PublicHubs from './components/PublicHubs'

const MIXTAPE_CLONE_DEFAULT = '1FEyUA9W4jfSZRREgqHEUstQGhUeaNcRWG'

@inject('site')
@observer
class Home extends Component {
  createMixtape () {
    this.props.site.cloneSite(MIXTAPE_CLONE_DEFAULT)
  }

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

            <Divider
              as='h4'
              className='header'
              horizontal
              style={{ margin: '3em 0em' }} />

            <Grid centered>
              <Button basic size='massive' color='blue' onClick={this.createMixtape.bind(this)} >
                Create a Mixtape
              </Button>
            </Grid>

          </Container>
        </Segment>

        <Segment style={{ padding: '8em 0em' }} vertical>
          <Container>
            <Header as='h3' style={{ fontSize: '2em' }}>About</Header>

            <Grid>
              <Grid.Column width={6}>
                <p style={{ fontSize: '1.1em', color: 'rgba(0,0,0,.6)' }}>
                  Mixtape is a playlist sharing platform created with the purpose of sharing your favorite music with friends and strangers. It also allow building playlist with several of people which will be grouped in a "hub".
                </p>
                <Header as='h4'>Why ?</Header>
                <p style={{ fontSize: '1.1em', color: 'rgba(0,0,0,.6)' }}>
                  Because I can.
                </p>
              </Grid.Column>
              <Grid.Column width={10}>
                <Image src='assets/img/Mixtape.png' fluid />
              </Grid.Column>
            </Grid>
          </Container>
        </Segment>

        <Segment style={{ padding: '8em 0em' }} vertical>
          <Container>
            <Grid>
              <Grid.Row columns={3}>
                <Grid.Column textAlign='center'>
                  <Image src='assets/img/bitcoin-qr-code.png' centered />
                  <p>1BzrPMr7qrca2wMV4a1qeH4CmJEKtAbrKW</p>
                </Grid.Column>
                <Grid.Column textAlign='center'>
                  <Image src='assets/img/dogecoin-qr-code.png' centered />
                  <p>DR252U5g3DECTpXsx8t4PBaePgepD1oADw</p>
                </Grid.Column>
                <Grid.Column>
                  <Header as='h3' style={{ fontSize: '2em' }}>Donation</Header>
                  <p style={{ fontSize: '1.1em', color: 'rgba(0,0,0,.6)' }}>
                    You can help me to improve Mixtape by doing a donation. Those donations would not only be use for Mixtape, I will also dedicate some of my times writting on my experience/good practice/libraries/plugins. As much as possible I will engage myself in giving back to the Zeronet community by focusing on documenting my work.
                  </p>
                  <Header as='h4'>Why Dogecoin ?</Header>
                  <p style={{ fontSize: '1.1em', color: 'rgba(0,0,0,.6)' }}>
                    I dunno. Fun.
                  </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>

        <Segment inverted vertical style={{ padding: '5em 0em' }}>
          <Container>
            <Grid style={{textAlign: 'center'}}>
              <Grid.Column width={8}>
                <Header as='h3' inverted>Ressources</Header>
                <a href='/1EMcXwk7qQdY3pbj86A98gZHjDBNRrscdL/?Post:59:Creating+your+Mixtape+on+ZeroNet+(Spotify+alternative)'>Creating your Mixtape on ZeroNet (Spotify alternative)</a>
                {/*<p>Bitcoin : 1BzrPMr7qrca2wMV4a1qeH4CmJEKtAbrKW</p>
                <p>Dogecoin : DR252U5g3DECTpXsx8t4PBaePgepD1oADw</p> */}
              </Grid.Column>
              <Grid.Column width={8}>
                <Header as='h3' inverted>Other</Header>
                <p>Like this project ? Check also <a href='/ZeroLSTN.bit/'>ZeroLSTN</a>.</p>
              </Grid.Column>
            </Grid>
          </Container>
        </Segment>
      </div>
    )
  }
}

export default Home
