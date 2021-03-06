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
  @observable playlistIndex = []

  constructor (history) {
    super()

    this.history = history

    this.fetchServerInfo()

    this.feedListFollow()

    this.fetchHubs()

    // Fetch the playlists which can be downloaded
    this.fetchMixtapeIndexPlaylist()

    this.cmd('siteInfo', {}, (info) => {
      this.setSiteInfo(info)

      if (info.settings.permissions.indexOf('Merger:Mixtape') === -1) {
        this.cmd('wrapperPermissionAdd', 'Merger:Mixtape', (res) => {
          if (res === 'ok') {
            this.mergerSiteAdd('1Nwdm8MooUizdkgaUdAdqqjyK1xXjY57PK')
              .then((res) => {
                if (res === 'ok') {
                  // Fetch the playlists which can be downloaded
                  setTimeout(() => this.fetchMixtapeIndexPlaylist(), 2000)
                }
              })
          }
        })
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

  @action.bound
  setPlaylistIndex (playlists) {
    this.playlistIndex = playlists
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
    return this.cmdp('mergerSiteList', [true])
      .then((data) => {
        data = Object.entries(data)
        this.setHubs(data)
      }).catch((err) => {
        console.log(err)
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
      '?playlist/"+hub+"' AS url \
      FROM song JOIN json ON song.json_id = json.json_id WHERE json.site='" + hub + "'"
    let params = ['']

    let newFeeds = {
      ... toJS(this.feeds),
      [hub]: [query, params]
    }

    return this.cmdp('feedFollow', [newFeeds])
      .then((res) => {
        this.setFeeds(newFeeds)
      })
  }

  unfollowFeed (hub) {
    let newFeeds = toJS(this.feeds)

    delete newFeeds[hub]

    return this.cmdp('feedFollow', [newFeeds])
      .then((res) => {
        this.setFeeds(newFeeds)
      })
  }

  feedListFollow () {
    return this.cmdp('feedListFollow')
      .then((res) => {
        this.setFeeds(res)
      })
  }

  supportHub (hub, title) {
    return this.cmdp('optionalHelpAll', {value: true, address: hub})
      .then(() => {
        /* Update with new value */
        this.fetchHubs()
      })
  }

  unsupportHub (hub) {
    return this.cmdp('optionalHelpAll', {value: false, address: hub})
      .then(() => {
        /* Update with new value */
        this.fetchHubs()
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

  fileGet (innerPath) {
    return this.cmdp('fileGet', [innerPath, false])
  }

  editFile (innerPath, content) {
    return this.cmdp('fileWrite', [innerPath, fileEncode(content)])
  }

  muteUser (authAddress, certUserId, reason) {
    return this.cmdp('muteAdd', [authAddress, certUserId, reason])
  }

  mergerSiteAdd (addresses) {
    return this.cmdp('mergerSiteAdd', [addresses])
  }

  signAndPublish (innerPath) {
    return this.cmdp('siteSign', ["stored", innerPath])
      .then((res) => {
        if (res !== 'ok') {
          throw new Error('Failed to sign content')
        }

        return this.cmdp('sitePublish', ["stored", innerPath])
      })
  }

  editMixtape (hub, title, description) {
    let innerPath = 'merged-Mixtape/' + hub + '/content.json'
    // Ugly ! We should be using await/async
    return this.fileGet(innerPath)
      .then((content) => {
        content = JSON.parse(content)

        if (!content.signers) {
          content.signers = [this.siteInfo.auth_address]
        }

        content.title = title ? title : content.title
        content.description = description ? description : content.description

        return this.editFile(innerPath, content)
          .then((res) => {
            if (res !== 'ok') {
              throw new Error('Fail to edit')
            }

            // We modified we need to update hubs info now
            this.fetchHubs()

            return this.signAndPublish(innerPath)
          })
      })
  }

  createMixtape (name, description, isPublic) {
    console.log('Create new mixtape : ', {name, description, isPublic})
    this.cloneSite('1FEyUA9W4jfSZRREgqHEUstQGhUeaNcRWG')
  }

  editPermission (hub, permissions) {
    let innerPath = 'merged-Mixtape/' + hub + '/data/users/content.json'

    return this.fileGet(innerPath)
      .then((content) => {
        content = JSON.parse(content)

        console.log(content.signers)

        if (!content.signers) {
          content.signers = [this.siteInfo.auth_address]
        }

        content.user_contents.permissions = permissions
        console.log(content.user_contents.permissions)

        return this.editFile(innerPath, content)
          .then((res) => {
            if (res !== 'ok') {
              throw new Error('Fail to edit')
            }

            // We modified we need to update hubs info now
            this.fetchHubs()

            return this.signAndPublish(innerPath)
          })

      })
  }

  // Bad bad bad
  fetchMixtapeIndexPlaylist () {
    let query = 'SELECT * FROM playlist'
    return new Promise((resolve, reject) => {
      this.cmdp('dbQuery', [query])
        .then((response) => {
          this.setPlaylistIndex(response)
          resolve()
        })
    })
  }

}

export default Site
