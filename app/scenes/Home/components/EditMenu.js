import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

import EditModal from './EditModal'

@observer
class EditMenu extends Component {
  @observable color = '#ccc'
  @observable openEdit = false

  handleClickMenu (event) {
    event.preventDefault()
  }

  handleMouseEnter () {
    this.color = '#777'
  }

  handleMouseLeave () {
    this.color = '#ccc'
  }

  getStyles () {
    return Object.assign({}, {
      display: 'inline-block',
      height: '30px',
      width: '30px',
      textAlign: 'center',
      verticalAlign: 'middle',
      //transition: 'all 0.3s',
      lineHeight: '30px',
      fontSize: '20px',
      fontWeight: 'normal',
      textDecoration: 'none',
      transition: 'none',
      color: this.color,
      float: 'right'
    }, this.props.style)
  }

  handleEditClick () {
    this.openEdit = true
  }

  render () {
    return (
      <Dropdown text='⋮' icon={false} onMouseEnter={this.handleMouseEnter.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)} style={this.getStyles()} onClick={this.handleClickMenu}>
        <Dropdown.Menu>
          <Dropdown.Item text={this.props.isFollowing ? 'Follow ✔' : 'Follow'} onClick={this.props.isFollowing ? this.props.unfollowFeed : this.props.followFeed} />
          <Dropdown.Item text={this.props.isSupporting ? 'Support ✔' : 'Support'} onClick={this.props.isSupporting ? this.props.unsupportPlaylist : this.props.supportPlaylist} />
          { this.props.hubInfo.settings.own ?
            <Dropdown.Divider /> : null }
          { this.props.hubInfo.settings.own ?
            <Dropdown.Item text='Edit' onClick={this.handleEditClick.bind(this)} />
            : null }
          <EditModal open={this.openEdit} hub={this.props.hubInfo} close={() => { this.openEdit = false}} />
        </Dropdown.Menu>
      </Dropdown>
    )
  }

}

export default EditMenu
