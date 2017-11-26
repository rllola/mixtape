import { observable, computed, action } from 'mobx'
import EventEmitter from 'events'

class Playlist extends EventEmitter {
  @observable songs = []
  @observable play
  index = 0

  constructor (siteStore) {
    super()

    this.siteStore = siteStore
  }

  @computed get
  src () {
    if (this.play) {
      return '/15t2dFCcxamJnPkp5yTFfxGReeFphvmnE4/merged-Mixtape/' + this.play.site + '/' + this.play.directory + '/' + this.play.file_name
    }
    return null
  }

  @action
  setIndex (index) {
    this.index = index
  }

  @action
  setPlay (song) {
    console.log(song.site)
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
    let query = 'SELECT * FROM song JOIN json ON song.json_id = json.json_id WHERE json.site="' + hub + '"'
    return new Promise((resolve, reject) => {
      this.siteStore.cmdp('dbQuery', [query])
      .then((response) => {
        console.log(response)
        this.songs = response
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
}

export default Playlist
