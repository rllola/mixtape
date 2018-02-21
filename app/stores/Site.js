import { observable, action, computed } from 'mobx'
import { fileEncode } from '../utils/encode'
import EventEmitter from 'events'
import ZeroFrame from 'zeroframe'
import sanitize from 'sanitize-filename'

class Site extends ZeroFrame {
  @observable serverInfo
  @observable siteInfo
  @observable hubs = []

  constructor () {
    super()

    this.fetchServerInfo()

    this.cmd('siteInfo', {}, (info) => {
      this.setSiteInfo(info)
      if (info.settings.permissions.indexOf('Merger:Mixtape') === -1) {
        this.cmd('wrapperPermissionAdd', 'Merger:Mixtape')
      }
    })

    this.eventEmitter = new EventEmitter()
  }

  @computed
  get isConnected () {
    if (this.siteInfo) {
      return this.siteInfo.cert_user_id !== null
    }
    return false
  }

  @computed
  get username () {
    return this.siteInfo.cert_user_id
  }

  @action.bound
  setServerInfo (info) {
    this.serverInfo = info
  }

  @action.bound
  setSiteInfo (info) {
    this.siteInfo = info
  }

  @action.bound
  setHubs (hubs) {
    this.hubs = hubs
  }

  onRequest (cmd, message) {
    if (cmd === 'setSiteInfo') {
      this.setSiteInfo(message.params)
      if (message.params.event[0] === 'file_done') {
        this.eventEmitter.emit('fileDone', message.params)
      }
    } else {
      console.log('Unknown command ', cmd, message.params)
    }
  }

  fetchServerInfo () {
    this.cmd('serverInfo', {}, (response) => {
      this.setServerInfo(response)
    })
  }

  fetchHubs () {
    this.cmd('mergerSiteList', [true], (data) => {
      this.setHubs(Object.entries(data))
    })
  }

  fetchOptionalFileList (hub) {
    return this.cmdp('optionalFileList', {'address': hub, filter: ''})
  }

  checkContentJson (innerPath, callback) {
    this.cmd('fileGet', [innerPath, false], (res) => {
      let data = {}

      if (res) {
        data = JSON.parse(res)
      }

      if (data.optional === '(?!data.json)') {
        return callback()
      }
      data.optional = '(?!data.json)'

      this.cmd('fileWrite', [innerPath, fileEncode(data)], callback)
    })
  }

  registerSongInDataJson (artist, title, fileName, hub, callback) {
    let innerPath = 'merged-Mixtape/' + hub + '/data/users/' + this.siteInfo.auth_address + '/data.json'
    this.cmd('fileGet', [innerPath, false], (res) => {
      let data = {
        hub: hub,
        song: []
      }

      if (res) {
        data = JSON.parse(res)
      }

      data.song.push({
        'song_id': data.song.length,
        'title': title,
        'artist': artist,
        'file_name': fileName,
        'date_added': new Date()
      })

      this.cmd('fileWrite', [innerPath, fileEncode(data)], callback)
    })
  }

  registerSong (hub, artist, title, file, thumbnail, callback) {
    let innerPath = 'merged-Mixtape/' + hub + '/data/users/' + this.siteInfo.auth_address

    this.checkContentJson(innerPath + '/content.json', (res) => {
      this.cmd('bigfileUploadInit', ['merged-Mixtape/' + hub + '/data/users/' + this.siteInfo.auth_address + '/' + sanitize(file.name).replace(/[^\x00-\x7F]/g, '').replace('&', ''), file.size], (initRes) => {
        var formdata = new FormData()
        formdata.append(file.name, file)

        console.log(initRes)

        var req = new XMLHttpRequest()
        req.upload.addEventListener('progress', console.log)
        req.upload.addEventListener('loadend', (res) => {
          // TODO : res give you the relative path of the file
          console.log(res)
          this.cmd('bigfileUploadInit', ['merged-Mixtape/' + hub + '/data/users/' + this.siteInfo.auth_address + '/' + sanitize('thumbnail-' + file.name).replace(/[^\x00-\x7F]/g, '').replace('&', ''), thumbnail.size], (initRes) => {
            var formdataBis = new FormData()
            formdataBis.append(thumbnail.name, thumbnail)

            console.log(initRes)

            var reqbis = new XMLHttpRequest()
            reqbis.upload.addEventListener('progress', console.log)
            reqbis.upload.addEventListener('loadend', (res) => {
              console.log(res)
              this.registerSongInDataJson(artist, title, sanitize(file.name).replace(/[^\x00-\x7F]/g, '').replace('&', ''), hub, () => {
                let innerPathContentJson = innerPath + '/content.json'
                let innerPathDataJson = innerPath + '/data.json'
                this.cmd('siteSign', {inner_path: innerPathDataJson}, (res) => {
                  if (res === 'ok') {
                    this.cmd('sitePublish', {inner_path: innerPathContentJson}, (res) => {
                      callback()
                    })
                  }
                })
              })
            })
            reqbis.withCredentials = true
            reqbis.open('POST', initRes.url)
            reqbis.send(formdataBis)
          })
        })
        req.withCredentials = true
        req.open('POST', initRes.url)
        req.send(formdata)
      })
    })
  }

  pushState (state, title, relativeUrl) {
    this.cmd('wrapperPushState', [state, title, relativeUrl])
  }

  replaceState (state, title, relativeUrl) {
    this.cmd('wrapperReplaceState', [state, title, relativeUrl])
  }

  selectUser () {
    this.cmd('certSelect', {'accepted_domains': ['zeroid.bit'], 'accept_any': true}, () => {})
  }

  showWrapperNotification (message) {
    this.cmd('wrapperNotification', ['info', message, 10000])
  }
}

export default Site
