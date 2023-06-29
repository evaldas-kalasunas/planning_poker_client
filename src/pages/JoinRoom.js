import React, { useContext, useEffect } from 'react';
import * as TYPES from '../types';
import { useParams } from 'react-router-dom';
import Page from './Page';

import './page.css';

import Input from '../components/Input';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import useCustomInputHook from './../hooks/inputHook';

import { socket } from '../services/socket.service';

import StateContext from '../contexts/StateContext';
import DispatchContext from '../contexts/DispatchContext';
import { v4 as uuidv4 } from 'uuid'

export default function JoinRoom(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [ name, setName ] = useCustomInputHook('')
  const { roomId } = useParams()
  // const {urlroomId} = props; 
  const uniquePlayerId = uuidv4() 
  
  const handleClick = () => {
    const player = { name: name, isHost: false, id: uniquePlayerId, vote: 0, socketId: '', roomId: roomId, isActive: true}
    socket.emit('join-room', { roomId, player })
  }

  // TODO: Extract ID from URL or take directly
  return (
    <Page title="Join Room" buttonPage={true}>
      <form>
        <Input type="text" name="roomId" placeholder="Enter your name" onChange={e => setName(e)} />
        <Link to={`/mainView/${roomId}/${name}`}>
          <Button text="Join Room" clicked={handleClick}/>
        </Link>
      </form>
    </Page>
  )
}
