import React, { useContext, useState } from 'react'
import Page from './Page'

import './page.css'

import Input from '../components/Input'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'

import useCustomInputHook from '../hooks/inputHook'
import { v4 as uuidv4 } from 'uuid'

import * as TYPES from '../types'
import DispatchContext from '../contexts/DispatchContext'


import { socket } from '../services/socket.service'

export default function CreateRoom() {
  const [hostName, setHostName] = useCustomInputHook('');

  const appDispatch = useContext(DispatchContext)
  const navigate = useNavigate();
  

  function handleClick() {
    const uniqueRoomId = uuidv4()
    const uniquePlayerId = uuidv4() // used also for key in map
    const hostData = {name: hostName, isHost: true, id: uniquePlayerId, vote: 0, socketId: '', roomId: uniqueRoomId, isActive: true}

    socket.emit('create-room', { roomId: uniqueRoomId, host: hostData })

    appDispatch({ type: TYPES.ADD_PLAYER, value: hostData})
    navigate(`/mainView/${uniqueRoomId}/${hostName}`)
  }

  return (
       <Page title="Create Room" buttonPage={true} >
      <form>
        <Input
          type="text"
          name="hostName"
          placeholder="Type your name"
          onChange={e => setHostName(e)}
          value={hostName}
        />
        {/* <Link to={`/mainView/${roomId}`}> */}
          <Button text="Create Room" clicked={handleClick}/>
        {/* </Link> */}
      </form>
    </Page>
  )
}
