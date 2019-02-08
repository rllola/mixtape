import React from 'react'
import { Grid } from 'semantic-ui-react'

import ThumbnailContainer from './ThumbnailContainer'

// All extensions accepted by Firefox
const extensions = ['webm', 'ogg', 'oga', 'mogg', 'opus', 'm4a', 'm4b', 'mp3', 'wav', 'flac']

const SongList = (props) => {
  return (
    <Grid columns={2} padded>
      {props.songs.map((value, index) => {
        // Don't show if no extension
        if (extensions.indexOf(value.file_name.split('.').pop()) < 0) { return }
        return (
          <Grid.Column key={index} style={{ padding: 0 }}>
            <ThumbnailContainer song={value} index={index} />
          </Grid.Column>
        )
      })}
    </Grid>
  )
}

export default SongList
