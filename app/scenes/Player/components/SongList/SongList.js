import React from 'react'
import { Grid } from 'semantic-ui-react'

import Thumbnail from './Thumbnail'

const SongList = (props) => {
  return (
    <Grid columns={2} padded>
      {props.songs.map((value) => (
        <Grid.Column key={value.song_id} style={{ padding: 0 }}>
          <Thumbnail song={value} />
        </Grid.Column>
      ))}
    </Grid>
  )
}

export default SongList
