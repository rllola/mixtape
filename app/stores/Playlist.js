import { observable, computed, action } from 'mobx'
import EventEmitter from 'events'
import { fileEncode } from '../utils/encode'
import sanitize from 'sanitize-filename'

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
        if (event.event[1].indexOf('content.json') > -1 || event.event[1].indexOf('data.json') > -1) {
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
          if (!this.play) {
            this.play = response[this.index]
          }
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  fetchOptionalFileInfo (innerPath) {
    return this.siteStore.cmdp('optionalFileInfo', {'inner_path': innerPath})
  }

  getHubRules (innerPath) {
    return this.siteStore.cmdp('fileRules', {'inner_path': innerPath})
  }

  editSong (songId, hub, artist, title, thumbnail, callback) {
    let innerPath = 'merged-Mixtape/' + hub + '/data/users/' + this.siteStore.siteInfo.auth_address

    if (thumbnail) {
      this.siteStore.cmd('bigfileUploadInit', ['merged-Mixtape/' + hub + '/data/users/' + this.siteStore.siteInfo.auth_address + '/' + sanitize(thumbnail.name).replace(/[^\x00-\x7F]/g, ''), thumbnail.size], (initResThumbnail) => {
        var formdataBis = new FormData()
        formdataBis.append(thumbnail.name, thumbnail)

        console.log(initResThumbnail)

        var reqbis = new XMLHttpRequest()
        reqbis.upload.addEventListener('progress', console.log)
        reqbis.upload.addEventListener('loadend', (res) => {
          console.log(res)
          this.editSongInDataJson(songId, artist, title, initResThumbnail.file_relative_path, hub, () => {
            let innerPathContentJson = innerPath + '/content.json'
            let innerPathDataJson = innerPath + '/data.json'
            this.siteStore.cmd('siteSign', {inner_path: innerPathDataJson}, (res) => {
              if (res === 'ok') {
                this.siteStore.cmd('sitePublish', {inner_path: innerPathContentJson}, (res) => {
                  callback()
                })
              }
            })
          })
        })
        reqbis.withCredentials = true
        reqbis.open('POST', initResThumbnail.url)
        reqbis.send(formdataBis)
      })
    } else {
      this.editSongInDataJson(songId, artist, title, null, hub, () => {
        let innerPathContentJson = innerPath + '/content.json'
        let innerPathDataJson = innerPath + '/data.json'
        this.siteStore.cmd('siteSign', {inner_path: innerPathDataJson}, (res) => {
          if (res === 'ok') {
            this.siteStore.cmd('sitePublish', {inner_path: innerPathContentJson}, (res) => {
              callback()
            })
          }
        })
      })
    }
  }

  editSongInDataJson (songId, artist, title, thumbnailFileName, hub, callback) {
    let innerPath = 'merged-Mixtape/' + hub + '/data/users/' + this.siteStore.siteInfo.auth_address + '/data.json'
    this.siteStore.cmd('fileGet', [innerPath, false], (res) => {
      let data = {
        hub: hub,
        song: []
      }

      if (res) {
        data = JSON.parse(res)
      }

      var song = data.song.find(function (song) {
        return song.song_id === songId
      })

      var index = data.song.indexOf(song)

      if (song) {
        data.song[index].title = title || data.song[index].title
        data.song[index].artist = artist || data.song[index].artist
        data.song[index].thumbnail_file_name = thumbnailFileName || data.song[index].thumbnail_file_name
      }

      this.siteStore.cmd('fileWrite', [innerPath, fileEncode(data)], callback)
    })
  }

  // TODO: Delete song but does not remove the files from the repository.
  deleteSong (songId, hub, callback) {
    let innerPath = 'merged-Mixtape/' + hub + '/data/users/' + this.siteStore.siteInfo.auth_address + '/data.json'
    this.siteStore.cmd('fileGet', [innerPath, false], (res) => {
      let data = {
        hub: hub,
        song: []
      }

      if (res) {
        data = JSON.parse(res)
      }

      var song = data.song.find(function (song) {
        return song.song_id === songId
      })

      if (!song) {
        console.log('NO SONG TO DELETE')
        callback()
        return
      }

      var index = data.song.indexOf(song)

      data.song.splice(index, 1)

      this.siteStore.cmd('fileWrite', [innerPath, fileEncode(data)], callback)
    })
  }
}

export default Playlist
