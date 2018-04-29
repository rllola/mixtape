import { observable, action, computed } from 'mobx'
import { fileEncode } from '../utils/encode'
import EventEmitter from 'events'
import ZeroFrame from 'zeroframe'
import sanitize from 'sanitize-filename'

class Site extends ZeroFrame {
  @observable serverInfo
  @observable siteInfo
  @observable hubs = []

  constructor (history) {
    super()

    this.history = history

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

  @computed
  get authAddress () {
    return this.siteInfo.auth_address
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
      if (message.params.event) {
        if (message.params.event[0] === 'file_done') {
          this.eventEmitter.emit('fileDone', message.params)
        }
      }
    } else {
      if (cmd === 'wrapperPopState') {
        let array = message.params.href.split('?')
        let state = message.params.state ? message.params.state.state : message.params.state
        if (array.length > 1) {
          this.history.replace(array[1], state)
        } else {
          this.history.replace('/', state)
        }
      } else {
        console.log('Unknown command ', cmd, message.params)
      }
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
