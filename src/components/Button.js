import React from 'react'
import './button.css'


export default function Button(props) {
  return (
    <button 
      className={(props.size === 'sm' ? `primary-btn-small btn-width-small ${props.disabled ? 'btn-disabled' : ''}` : `primary-btn-default ${props.disabled ? 'btn-disabled' : ''}`) + ` ${props.className}`}
      onClick={ props.disabled ? undefined : props.clicked} >{props.text}</button>
  )
}
