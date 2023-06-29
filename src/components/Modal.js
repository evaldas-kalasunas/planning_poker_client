import React, { useContext, useEffect } from 'react'

import StateContext from '../contexts/StateContext'
import DispatchContext from '../contexts/DispatchContext'
import './modal.css'
import { SET_SHOW_MODAL } from '../types'
import { socket } from './../services/socket.service';

export default function Modal(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  document.addEventListener('click', (e) => {
    if (e.target.matches('.modal-close-btn')) {
            closeModal()
        }
  })

  function closeModal() {
    appDispatch({type: SET_SHOW_MODAL, value: false})
  }

  
  return (
    <div id="modal" className={appState.showModal ? 'modal-show' : 'modal-hide'}>
        <div className='modal-container'>
            <div>
                Header
                <i className='fa fa-x modal-close-btn'></i>
            </div>
            <div>
                Content
                <ul>
                {appState.resultsData.map(resultStory => <li key={resultStory.id}>{resultStory.text} | {resultStory.points}</li>)}
                </ul>
            </div>
            <div>
                Footer
            </div>
        </div>
    </div>
  )
}
