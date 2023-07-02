import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate  } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

import StateContext from '../contexts/StateContext'
import Page from './Page';

import './hostView.css'
import Button from '../components/Button';
import DispatchContext from './../contexts/DispatchContext';

import * as TYPES from '../types'
import Card from '../components/Card';
import { socket } from '../services/socket.service';

// TODO: Rename from hostView to more generic. VoteView?
export default function HostView() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  // let [minutes, setMinutes] = useState(appState.timerMinutes)
  // let [seconds, setSeconds] = useState(appState.timerSeconds)
  const [error, setError] = useState('')
  const { roomId, userName, vote } = useParams();
  const [ selectedPoints, setSelectedPoints ]  = useState('');
  const [ clearSelectedClass, setClearSelectedClass ] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    socket.on('room-not-exists', (message)=> {
      setError(message)
    })
  }, [socket, roomId]) 
 

  
  useEffect(() => {
    socket.on('set-votes', (data) => {
      appDispatch({type: TYPES.SET_VOTES, value: data})
    })
  }, [])

  const handleAddVotes = (e, votes) => {
    setClearSelectedClass(false);
    setSelectedPoints(votes);
    socket.emit('add-votes', { votes, room: roomId, playerId: appState.currentPlayer.id })

    // navigate(`/mainView/${appState.roomId}/${appState.name}/${points}`);
  }

  const handleResetVoting = (e) => {
    setClearSelectedClass(true);
    appDispatch({type: TYPES.RESET_VOTING, value: {
      startVoting: false,
      story: appState.selectedVoteStory,
      // timerSeconds: appState.timerSeconds,
      // timerMinutes: appState.timerMinutes
    }})
  }

  const handleStopVoting = () => {
    socket.emit("set-stop-voting", {
      roomId: appState.roomId,
      startVoting: false,
      hideShowVotes: appState.hideVotes,
      votedStory: appState.selectedVoteStory
    });
  }

  useEffect(() => {
    socket.on("stop-voting", (data) => {
      appDispatch({type: TYPES.STOP_VOTING, value: {
        startVoting: data.startVoting,
        hideShowVotes: data.hideShowVotes,
        votedStory: data.votedStory
      }});
    })
  }, []);

  useEffect(() => {
    socket.on("hide-show-votes", (data) => {
      appDispatch({type: TYPES.HIDE_SHOW_VOTES, value: data});
    })
  }, [])

  const handleHideVotes = () => {
    socket.emit("set-hide-show", { roomId: appState.roomId, hideShowVotes: appState.hideVotes});
  }

  return (
    <Page title="Host View" buttonPage={false}>
      {console.log(appState.hideVotes)}
      {/* key here required to later only fire use effect when one particular changes */}
        <Sidebar size="wide" isMain={true} key='host-sidebar'/>
        <div className='host-view-story'> 
          {appState.selectedViewStory ? 
            appState.selectedViewStory : 
              appState.showCards ? `${appState.selectedVoteStory.text}`    
            : 'Please select story to view or vote.'}
          {appState.showCards && 
            <>
              <div className='host-view-cards-row-1'>
                <Card className={selectedPoints === 0 && !clearSelectedClass ? "selected-card" : ""} value={0} isHalf={false} handleAddVotes={(e) => handleAddVotes(e, 0)}/>
                <Card className={selectedPoints === 0.5 && !clearSelectedClass ? "selected-card" : ""} value={0.5} isHalf={true} handleAddVotes={(e) => handleAddVotes(e, 0.5)}/>
                <Card className={selectedPoints === 1 && !clearSelectedClass ? "selected-card" : ""} value={1} isHalf={false} handleAddVotes={(e) => handleAddVotes(e, 1)}/>
                <Card className={selectedPoints === 2 && !clearSelectedClass ? "selected-card" : ""} value={2} isHalf={false} handleAddVotes={(e) => handleAddVotes(e, 2)}/>
                <Card className={selectedPoints === 3 && !clearSelectedClass ? "selected-card" : ""} value={3} isHalf={false} handleAddVotes={(e) => handleAddVotes(e, 3)}/>
                <Card className={selectedPoints === 5 && !clearSelectedClass ? "selected-card" : ""} value={5} isHalf={false} handleAddVotes={(e) => handleAddVotes(e, 5)}/>
                <Card className={selectedPoints === 8 && !clearSelectedClass ? "selected-card" : ""} value={8} isHalf={false} handleAddVotes={(e) => handleAddVotes(e, 8)}/>
              </div>
              <div className='host-view-cards-row-2'>
                <Card className={selectedPoints === 13 && !clearSelectedClass ? "selected-card" : ""} value={13} isHalf={false} handleAddVotes={(e) => handleAddVotes(e, 13)}/>
                <Card className={selectedPoints === 20 && !clearSelectedClass ? "selected-card" : ""} value={20} isHalf={false} handleAddVotes={(e) => handleAddVotes(e, 20)}/>
                <Card className={selectedPoints === 40 && !clearSelectedClass ? "selected-card" : ""} value={40} isHalf={false} handleAddVotes={(e) => handleAddVotes(e, 40)}/>
                <Card className={selectedPoints === 100 && !clearSelectedClass ? "selected-card" : ""} value={100} isHalf={false} handleAddVotes={(e) => handleAddVotes(e, 100)}/>
                <Card className={selectedPoints === '\uFF1F' && !clearSelectedClass ? "selected-card" : ""} value={'question'} isHalf={false} handleAddVotes={(e) => handleAddVotes(e, '\uFF1F')}/>
                <Card className={selectedPoints === '\u221E' && !clearSelectedClass ? "selected-card" : ""} value={'infinity'} isHalf={false} handleAddVotes={(e) => handleAddVotes(e, '\u221E')}/>
                <Card className={selectedPoints === '\u2615' && !clearSelectedClass ? "selected-card" : ""} value={'mug-hot'} isHalf={false} handleAddVotes={(e) => handleAddVotes(e, '\u2615')}/>
              </div>
              {appState.host.isHost ? <div className='host-view-buttons'>
                <Button text={appState.hideVotes ? "Show" : "Hide"} size='sm' clicked={(e)=> handleHideVotes(e)}/>
                <Button text="Stop" size='sm' clicked={(e)=> handleStopVoting(e)}/>
                <Button text="Reset" size='sm' clicked={(e)=> handleResetVoting(e)}/>
              </div> : null}
            </>
          }
        </div>
        <Sidebar isMain={false} key='player-sidebar'/>
    </Page>
  )
}
