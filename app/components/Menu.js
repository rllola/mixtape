import React, { Component } from 'react'
import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'

@observer
class Menu extends Component {
  @observable color = '#ccc'

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
      color: this.color
    }, this.props.style)
  }

  render () {
    return (
      <span  >⋮</span>
    )
  }
}

export default Menu
