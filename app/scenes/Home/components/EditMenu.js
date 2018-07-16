import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

@observer
class EditMenu extends Component {
  @observable color = '#ccc'

  handleClickMenu (event) {
    console.log('Clicked Menu !')

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

  handleFollowClick () {
    console.log('Folow !')
  }

  handleSupportClick () {
    console.log('Support !')
  }

  handleEditClick () {
    console.log('Edit !')
  }


  render () {
    return (
      <Dropdown text='⋮' icon='none' onMouseEnter={this.handleMouseEnter.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)} style={this.getStyles()} onClick={this.handleClickMenu}>
        <Dropdown.Menu>
          <Dropdown.Item text={{'Follow'}} onClick={this.handleFollowClick.bind(this)} />
          <Dropdown.Item text='Support ✔' onClick={this.handleFollowClick.bind(this)} />
          { this.props.hubInfo.settings.own ?
            <Dropdown.Divider /> : null }
          { this.props.hubInfo.settings.own ?
            <Dropdown.Item text='Edit' onClick={this.handleEditClick.bind(this)} />
            : null }
        </Dropdown.Menu>
      </Dropdown>
    )
  }

}

export default EditMenu
