import React, { useState, useEffect } from 'react';
import './App.css';
import { getPlayerState } from './localState';
import Alert from './components/Alert';
import JoinForm from './components/JoinForm';
import RollForm from './components/RollForm';
import RollLog from './components/RollLog';
import LeaveForm from './components/LeaveForm';

type AlertData = {
  message: string | null;
}

function App() {
  const [playerState, setPlayerState] = useState(getPlayerState())
  const [alert, setAlert] = useState({message: null} as AlertData)

  const handleStorageUpdate = () => setPlayerState(getPlayerState())
  const alertCallback = (message: string) => setAlert({message: message})

  useEffect(() => {
    window.addEventListener("storage", () => handleStorageUpdate)
  })

  return (
    <div className="container">
      <header>
        <h1>
          Dice Party
        </h1>
      </header>
      <Alert visible={alert.message != null} message={""}></Alert>
      <JoinForm visible={!playerState.inParty} warnCallback={alertCallback}></JoinForm>
      <RollForm
        visible={playerState.inParty}
        partyId={playerState.partyId || ""}
        name={playerState.name || ""}></RollForm>
      <RollLog entries={[]}></RollLog>
      <LeaveForm visible={playerState.inParty}></LeaveForm>
    </div>
  );
}

export default App;
