import React from 'react'
import { inject } from 'mobx-react'

const Permission = (props) => {

  console.log(props.site)

  props.site.adminPermission()

  return (
    <p>You need ADMIN permission to be able to create mixtape. If you dont want to grant Mixtape admin mpermission you can follow this tutorial : <a href='/1EMcXwk7qQdY3pbj86A98gZHjDBNRrscdL/?Post:59:Creating+your+Mixtape+on+ZeroNet+(Spotify+alternative)'>Creating your Mixtape on ZeroNet (Spotify alternative)</a> </p>
  )
}

export default inject('site')(Permission)
