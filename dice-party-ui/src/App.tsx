import React, { useState, useEffect } from "react";
import "./App.css";
import { getPlayerStateFromLocal } from "./localState";
import Alert from "./components/Alert";
import JoinForm from "./components/JoinForm";
import RollForm from "./components/RollForm";
import RollLog from "./components/RollLog";
import LeaveForm from "./components/LeaveForm";
import ChangePartyModal from "./components/ChangePartyModal";

type AlertData = {
  message: string | null;
};

function App(): JSX.Element {
  function partyIdFromUrl(): string | null {
    return new URLSearchParams(window.location.search).get("partyId");
  }

  const [playerState, setPlayerState] = useState(getPlayerStateFromLocal());
  const [alert, setAlert] = useState({ message: null } as AlertData);
  const [urlPartyId, setUrlPartyId] = useState(partyIdFromUrl);
  const [changePartyModalVisible, setChangePartyModalVisible] = useState(true);

  const handleStorageUpdate = (): void =>
    setPlayerState(getPlayerStateFromLocal());
  const alertCallback = (message: string): void =>
    setAlert({ message: message });

  useEffect(() => {
    window.addEventListener("storage", () => handleStorageUpdate);
  }, []);

  function leaveParty(): void {
    window.localStorage.clear();
    setPlayerState(getPlayerStateFromLocal());
  }

  function setPartyIdInUrl(partyId: string): void {
    window.history.pushState({}, "", `/?partyId=${partyId}`);
    setUrlPartyId(partyId);
  }

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
        partyIdFromUrl={urlPartyId}
        setPartyIdInUrlCallback={setPartyIdInUrl}
      ></JoinForm>
      <RollForm
        visible={playerState.inParty}
        partyId={playerState.partyId}
        name={playerState.name}
        sessionId={playerState.sessionId}
        warnCallback={alertCallback}
      ></RollForm>
      <RollLog partyId={playerState.partyId}></RollLog>
      <LeaveForm
        visible={playerState.inParty}
        leavePartyCallback={leaveParty}
      ></LeaveForm>
      <ChangePartyModal
        visible={
          playerState.inParty &&
          urlPartyId !== null &&
          playerState.partyId !== urlPartyId &&
          changePartyModalVisible
        }
        currentParty={playerState.partyId}
        linkParty={urlPartyId}
        dismissCallback={(): void => setChangePartyModalVisible(false)}
        leavePartyCallback={(): void => {
          setChangePartyModalVisible(false);
          leaveParty();
        }}
        setPartyIdInUrlCallback={setPartyIdInUrl}
      ></ChangePartyModal>
    </div>
  );
}

export default App;
