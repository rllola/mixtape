import { observable, action, computed, toJS } from 'mobx'
import { fileEncode } from '../utils/encode'
import EventEmitter from 'events'
import ZeroFrame from 'zeroframe'
import sanitize from 'sanitize-filename'

class Site extends ZeroFrame {
  @observable serverInfo
  @observable siteInfo
  @observable hubs = []
  @observable feeds = []

  constructor (history) {
    super()

    this.history = history

    this.fetchServerInfo()

    this.feedListFollow()

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

  @action.bound
  setFeeds (feeds) {
    this.feeds = feeds
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

  followFeed (hub) {
    let query = "SELECT song_id AS event_uri, \
      'post' AS type, \
      CAST(round((julianday(date_added)- 2440587.5)*86400.0) AS integer) AS date_added, \
      artist || ' - ' || title AS title, \
      'New song added !' AS body, \
      '?' AS url \
      FROM song JOIN json ON song.json_id = json.json_id WHERE json.site='" + hub + "'"
    let params = ['']

    let newFeeds = {
      ... toJS(this.feeds),
      [hub]: [query, params]
    }

    return this.cmdp('feedFollow', [newFeeds])
      .then(() => {
        this.setFeeds(newFeeds)
      })
  }

  unfollowFeed (hub) {
    let newFeeds = toJS(this.feeds)

    delete newFeeds[hub]

    return this.cmdp('feedFollow', [newFeeds])
      .then(() => {
        this.setFeeds(newFeeds)
      })
  }

  feedListFollow () {
    return this.cmdp('feedListFollow')
      .then((res) => {
        this.setFeeds(res)
      })
  }

  cloneSite (hub) {
    return this.cmdp('siteClone', [hub])
      .then((res) => {
        console.log('Site cloned')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  createMixtape (name, description, isPublic) {
    console.log('Create new mixtape : ', {name, description, isPublic})
    this.cloneSite('1FEyUA9W4jfSZRREgqHEUstQGhUeaNcRWG')
  }

  adminPermission () {
    console.log('Ask for admin permission')
    this.cmd('wrapperPermissionAdd', 'ADMIN')
  }

}

export default Site
