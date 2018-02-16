import React from 'react'
import { Grid } from 'semantic-ui-react'

import ThumbnailContainer from './ThumbnailContainer'

const SongList = (props) => {
  return (
    <Grid columns={2} padded>
      {props.songs.map((value, index) => (
        <Grid.Column key={index} style={{ padding: 0 }}>
          <ThumbnailContainer song={value} index={index} />
        </Grid.Column>
      ))}
    </Grid>
  )
}

export default SongList
