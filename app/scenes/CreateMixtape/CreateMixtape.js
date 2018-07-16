import React, { Component } from 'react'
import {
  Container,
  Header,
  Segment
} from 'semantic-ui-react'

import SelectUser from '../../components/SelectUser'
import CreateMixtapeForm from './CreateMixtapeForm'
import CreateMixtapePermission from './CreateMixtapePermission'
import { inject, observer } from 'mobx-react'

const CreateMixtape = (props) => {

    const hasAdminPermission = props.site.siteInfo.settings.permissions.indexOf('ADMIN') < 0 ? false : true

    return (
      <div>
        <Segment
          inverted
          textAlign='center'
          style={{ minHeight: 300, padding: '1em 0em', backgroundImage: 'url(assets/img/1510335890477.jpg)', backgroundPosition: 'bottom', backgroundSize: 'cover' }}
          vertical >

          <Container textAlign='right'>
            <SelectUser as='a' inverted />
          </Container>

          <Container text>
            <Header
              as='h1'
              content='Create a Mixtape'
              inverted
              style={{ fontSize: '4em', fontWeight: 'normal', marginBottom: 0, marginTop: '1em' }} />

          </Container>
        </Segment>

        <Container style={{ paddingTop: '5em'}}>
          { hasAdminPermission ?
            <CreateMixtapeForm />
            : <CreateMixtapePermission /> }

        </Container>
      </div>
    )
}

export default inject('site')(observer(CreateMixtape))
