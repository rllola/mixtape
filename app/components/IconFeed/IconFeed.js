import React from 'react'
import './IconFeed.css'

const IconFeed = (props) => {
  var className = (props.following ? 'icon-feed following' : 'icon-feed')

  return (
    <span className={className} style={props.style} />
  )
}

export default IconFeed
