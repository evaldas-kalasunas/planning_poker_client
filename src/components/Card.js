import React from 'react'

export default function Card(props) {
  return ( 
    // TODO: this should have card.css if it's component
      props.isHalf ? <div className={`host-view-card-base host-view-half ${props.className}`} onClick={(e) => props.handleAddVotes(e, props.value)}>
            <i className='fa fa-1 fa-xs host-view-half-one'/>
            <i className='fa-solid fa-slash fa-flip-horizontal'/>
            <i className='fa fa-2 fa-xs host-view-half-two'/>
        </div> :
        <div className={`host-view-card-base ${props.className}` } onClick={(e) => props.handleAddVotes(e, props.value)}>
            {/* For values 0 to 0 there are icons, for 13 to 100 there are no, also icons are string type*/}
            {props.value < 10 || typeof props.value === 'string' ? 
                <i className={`fa fa-${props.value} fa-sm`}/> 
              : <i className='fa fa-sm'>{props.value}</i>}
        </div>
  )
}
