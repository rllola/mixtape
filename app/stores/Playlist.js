import { observable, computed, action } from 'mobx'
import EventEmitter from 'events'

import Constants from '../utils/constants'

class Playlist extends EventEmitter {
  @observable songs = []
  @observable play
  index = 0

  constructor (siteStore) {
    super()

    this.siteStore = siteStore

    this.siteStore.eventEmitter.on('fileDone', (event) => {
      if (event.address === this.play.site) {
        // Reload list
        // TEMPORARY
        if (event.event[1].indexOf('content.json') > -1 || event.event[1].indexOf('data.json') > -1 ) {
          // this.siteStore.showWrapperNotification('A new song has been added. The page need to be reloaded.')
          console.log('New song added')
        } else {
          // Update file info
          this.siteStore.showWrapperNotification('We received a new piece of the song')
        }
      }
    })
  }

  @computed get
  src () {
    if (this.play) {
      return '/' + Constants.APP_ID + '/merged-Mixtape/' + this.play.site + '/' + this.play.directory + '/' + this.play.file_name
    }
    return null
  }

  @action
  setIndex (index) {
    this.index = index
  }

  @action
  setPlay (song) {
    this.play = song
  }

  playSong (songIndex) {
    this.setIndex(songIndex)
    this.setPlay(this.songs[this.index])
    // TEMPORARY
    this.emit('songChanged')
  }

  increaseIndex () {
    let index = this.index

    index++
    if (index >= this.songs.length) {
      index = 0
    }

    this.setIndex(index)
  }

  playNextSong () {
    this.increaseIndex()
    this.setPlay(this.songs[this.index])
  }

  fetchSongsByHub (hub) {
    let query = 'SELECT * FROM song JOIN json ON song.json_id = json.json_id WHERE json.site="' + hub + '" ORDER BY date_added DESC'
    return new Promise((resolve, reject) => {
      this.siteStore.cmdp('dbQuery', [query])
      .then((response) => {
        this.songs = response
        console.log(response)
        if (!this.play) {
          this.play = response[this.index]
        }
        resolve()
      })
      .catch(() => {
        reject()
      })
    })
  }

  fetchOptionalFileInfo (innerPath) {
    return this.siteStore.cmdp('optionalFileInfo', {'inner_path': innerPath})
  }
}

export default Playlist
