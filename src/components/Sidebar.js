import React, { useContext, useEffect } from 'react'
import Button from './Button'
import Input from './Input'

import StateContext from '../contexts/StateContext'
import DispatchContext from './../contexts/DispatchContext';

import './sidebar.css'
import useCustomInputHook from './../hooks/inputHook';

import * as TYPES from '../types';
import Timer from './Timer';

import { v4 as uuidv4 } from 'uuid'

import { socket } from '../services/socket.service';
import { useNavigate, useParams } from 'react-router-dom'
import { Popup } from './Popup';


export default function Sidebar(props) {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)
    const navigate = useNavigate();
    const { roomId } = useParams()

    const [storyText, setStoryText, resetStoryText] = useCustomInputHook('');

    const GUEST_VIEW_LINK = `${window.location.origin}/joinRoom/${appState.roomId}`;

    useEffect(() => {
        console.log(appState)
        socket.on('update-players', (data) => {
            console.log('updated_players: ', data)
            appDispatch({ type: TYPES.UPDATE_PLAYERS, value: {players: data.players, player: data.player}})
        })
    }, [])

    useEffect(() => {
        socket.on("add-story", (data) => {
            console.log(data)
            appDispatch({type: TYPES.ADD_STORY, value: data})
        })
    }, [socket])
    

    const handleAddStory = () => {
        const storyId = uuidv4()   
        const story = { text: storyText, points: undefined, id: storyId }
        
        socket.emit('add-story', {story, room: appState.roomId})
        appDispatch({type: TYPES.ADD_STORY, value: story})
        
        resetStoryText()
    }

    useEffect(() => {
        socket.on('view-story', (story) => {
          appDispatch({type: TYPES.VIEW_STORY, value: story})
        })
      }, [])
    

    const handleView = (selectedStory) => {
        socket.emit('set-view-story', { story: selectedStory, room: appState.roomId })
    }

    useEffect(() => {
        socket.on("voting-started", (data) => {
            appDispatch({ type: TYPES.START_VOTING, value: data});
        });
    }, [socket]);

    const handleVote = (selectedStory) => {
        const data = {showCards: true,
            story:
            selectedStory,
            points: 0 ,
            startVoting: true,
            room: appState.roomId || roomId}
        socket.emit('start-voting', data);
    }
  // TODO: for future features
//   const handleShowResults = () => {
//     appDispatch({type: TYPES.SET_SHOW_MODAL, value: true})
//   }

  const handleCopyURL = () => {
      navigator.clipboard.writeText(GUEST_VIEW_LINK)
  }

  return (
    <div className={props.size === 'wide' ? 'wide-sidebar' : 'default-sidebar'}>
      {props.isMain ? 
        <div className='main-sidebar-container'>
            <h2 className='welcome-message'> 
                Welcome,
                <span style={{color: '#fff', marginLeft: '10px'}}>
                    {appState.host.isHost ? appState.host.name :
                    (appState.currentPlayer &&
                        !appState.currentPlayer.isHost &&
                        appState.currentPlayer.name ? appState.currentPlayer.name : 'tempGuest')}
                    </span>!
            </h2>
            {appState.host.isHost && <div className='sidebar-story-input'>
              <Input placeholder="Add story here" value={storyText} onChange={e => setStoryText(e)} size="lg"/> 
              <Button text="Add" size="sm" disabled={appState.startVoting} clicked={handleAddStory}/>
            </div>}
            <div className='sidebar-story-list-container'>
                <ul className='sidebar-story-ul'>
                    {appState.stories.map((story) => {
                        return <li key={story.id} className="sidebar-story-item"> 
                                <span className="sidebar-bullet"></span> 
                                    <span className='sidebar-story-text'>{story.text}</span> 
                                    {appState.host.isHost && <Button text="View" size="sm" disabled={appState.startVoting} clicked={() => handleView(story.text)}/>}
                                    {appState.host.isHost && <Button className="sidebar-vote-btn" disabled={appState.startVoting /*|| (appState.votedStories.includes(story.id))*/} text="Vote" size="sm" clicked={() => handleVote(story)}/>}
                            </li>
                    })}
                </ul>
            </div>
            {appState.host.isHost && <div className='sidebar-voted'>
                <span className='sidebar-voted-numbers'>{appState.votedStories.length}/{appState.stories.length} </span> Evaluated!
            </div>}
            {/* TODO: For future features */}
            {/* {appState.host.isHost && <div className='sidebar-results'>
                <Button text="Results" disabled={appState.startVoting} clicked={handleShowResults}/>
            </div>} */}
            {appState.host.isHost && <div className='sidebar-sharable-link'>
                Invite people: 
                    <span className='sidebar-link'>
                        {GUEST_VIEW_LINK}
                    </span> 
                    <Popup content={
                        <i className='fa fa-clone fa-md sidebar-copy-icon' onClick={handleCopyURL}></i>
                    }
                    tooltipText={"Link copied!"}
                    />
                    
            </div>}
            {/* {appState.host.isHost && <div className='sidebar-timer'>
                Set timer: <span className='sidebar-timer-settings'><Timer readOnly={false}/></span>
            </div>} */}
        </div>
      : <div  className='sidebar-players'> 
            {appState.players.map(player => (
             <div key={player.id}>
                {/* TODO: this should pick from players to have individual votes */}
                 {(!player.vote) ? <span className={appState.hideVotes ? 'sidebar-hide-votes' : 'sidebar-not-voted'}>X</span> : 
                        <span className={appState.hideVotes ? 'sidebar-hide-votes' : 'sidebar-player-votes'}>{player.vote}</span>}
                  <span className='sidebar-player'>{player.name}</span> 
        </div>))} </div>}
    </div>
  )
}
