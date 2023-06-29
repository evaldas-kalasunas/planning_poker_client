import React, { useContext } from 'react'

import StateContext from '../contexts/StateContext'
import DispatchContext from '../contexts/DispatchContext'
import './timer.css'

import * as TYPES from '../types'

export default function Timer() {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)
    
    function handleIncreaseMinutes() {
        if (appState.timerMinutes < 59) {
            appDispatch({type: TYPES.INCREASE_TIMER_MINUTES})
        }
    }

    function handleDecreaseMinutes() {
        if (appState.timerMinutes > 0) {
            appDispatch({type: TYPES.DECREASE_TIMER_MINUTES})
        }
    }

    function handleSetMinutes(e) {
    }

    function handleIncreaseSeconds() {
        if (appState.timerSeconds < 59) {
            appDispatch({type: TYPES.INCREASE_TIMER_SECONDS})
        }
    }

    function handleDecreaseSeconds() {
        if (appState.timerSeconds > 0) {
            appDispatch({type: TYPES.DECREASE_TIMER_SECONDS})
        }
    }
  return (
    //   TODO: Timer does not take updated values, only default ones
    <div className='timer'> 
        <>
            <i className='fa fa-minus fa-xs' onClick={handleDecreaseMinutes}/> 
            {appState.timerMinutes}
                {/* {appState.timerMinutes < 10 ? `0${appState.timerMinutes}` : appState.timerMinutes}  */}
            <i className='fa fa-plus fa-xs' onClick={handleIncreaseMinutes}/>
                <span className='timer-colon'>:</span>
            <i className='fa fa-minus fa-xs' onClick={handleDecreaseSeconds}/> 
            {appState.timerSeconds}
                {/* { appState.timerSeconds < 10 ? `0${appState.timerSeconds}` : appState.timerSeconds}   */}
            <i className='fa fa-plus fa-xs' onClick={handleIncreaseSeconds}/>
        </>
    </div>
  )
}
