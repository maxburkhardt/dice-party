import React, { useState, useEffect } from "react";
import "./App.css";
import { getPlayerState } from "./localState";
import Alert from "./components/Alert";
import JoinForm from "./components/JoinForm";
import RollForm from "./components/RollForm";
import RollLog from "./components/RollLog";
import LeaveForm from "./components/LeaveForm";

type AlertData = {
  message: string | null;
};

function App() {
  const [playerState, setPlayerState] = useState(getPlayerState());
  const [alert, setAlert] = useState({ message: null } as AlertData);

  const handleStorageUpdate = () => setPlayerState(getPlayerState());
  const alertCallback = (message: string) => setAlert({ message: message });

  const rollLog: JSX.Element[] = [];

  useEffect(() => {
    window.addEventListener("storage", () => handleStorageUpdate);
  });

  return (
    <div className="container">
      <header>
        <h1>Dice Party</h1>
      </header>
      <Alert visible={alert.message != null} message={alert.message}></Alert>
      <JoinForm
        visible={!playerState.inParty}
        warnCallback={alertCallback}
        setPlayerStateCallback={setPlayerState}
      ></JoinForm>
      <RollForm
        visible={playerState.inParty}
        partyId={playerState.partyId || ""}
        name={playerState.name || ""}
        sessionId={playerState.sessionId || ""}
        warnCallback={alertCallback}
      ></RollForm>
      <RollLog entries={rollLog}></RollLog>
      <LeaveForm
        visible={playerState.inParty}
        setPlayerStateCallback={setPlayerState}
      ></LeaveForm>
    </div>
  );
}

export default App;
