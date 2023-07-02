import React from 'react'
import Page from './Page'
import { Link } from 'react-router-dom'

import './page.css'
import './home.css'

import Button from '../components/Button'

export default function Home() {
  
  return (
    <Page title="Create Room" buttonPage={true}>
         <Link to="/joinRoom">
            <Button text="Join Room"/>
         </Link> 
         <Link to="/createRoom">
            <Button text="Create Room" className="create-room"/>
         </Link>
    </Page>
  )
}
