import React from 'react'

import './input.css'

export default function Input(props) { 
  return <input  
          className={props.size === 'lg' ? 'wide-input' : ''}
          type={props.type}
          name={props.name}
          placeholder={props.placeholder}
          onChange={props.onChange}
          value={props.value}/>
}