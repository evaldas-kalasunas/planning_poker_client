import { useEffect } from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import StateContext from './contexts/StateContext';
import DispatchContext from './contexts/DispatchContext';

import Home from './pages/Home';
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from './pages/JoinRoom';
import HostView from './pages/HostView';

import mainReducer from './mainReducer';
import { useImmerReducer } from 'use-immer';
import Modal from './components/Modal';
import { socket } from './services/socket.service';

const App = () => {
  const initialState = {
    currentPlayer: {},
    roomId: '',
    host: {
      hostName: '',
      isHost: false,
      id: ''
    },
    selectedViewStory: '',
    selectedVoteStory: {
      text: '',
      points: undefined, // if reimains undefined display X next to player
      id: ''
    },
    startVoting: false,
    hideVotes: true,
    votedStories: [], // to keep ids of voted stories
    players: [],
    stories: [],
    resultsData: [],
    showModal: false,
    showCards: false,
    timerMinutes: 0,
    timerSeconds: 15,
  }

  const [state, dispatch] = useImmerReducer(mainReducer, initialState)

  useEffect(() => {
    console.log(socket.connected)
  }, [socket]);

  useEffect(() => {
    socket.on("player-left", (data) => {
      console.log(data)
    })
  }, [socket]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Modal/>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/createRoom" element={<CreateRoom/>}/>
              {/* <Route path="/joinRoom" element={<JoinRoom/>}/> */}
              <Route path="/mainView/:roomId" element={<HostView/>}/>
              <Route path="/joinRoom/:roomId" element={<JoinRoom />}/>
              <Route path={`/mainView/:roomId`} element={<HostView/>}/>
              <Route path={`/mainView/:roomId/:userName`} element={<HostView/>}/>
              <Route path={`/mainView/:roomId/:userName/:vote`} element={<HostView/>}/>
              <Route path={`/mainView/:roomId/:userName/:hide`} element={<HostView/>}/>   
            </Routes>
          </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
