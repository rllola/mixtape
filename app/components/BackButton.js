import React from 'react'
import { Link } from 'react-router-dom'

const BackButton = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '15px' }}>
      <Link to='/' style={{ color: 'white' }}>
        <strong>Back</strong>
      </Link>
    </div>
  )
}

export default BackButton
