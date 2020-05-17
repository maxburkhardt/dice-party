import React, { useState } from "react";
import { setPlayerStateInLocal, PlayerState } from "../localState";
import { join } from "../partyApi";

export type Props = {
  visible: boolean;
  warnCallback: (message: string) => void;
  setPlayerStateCallback: (newState: PlayerState) => void;
  partyIdFromUrl: string | null;
  setPartyIdInUrlCallback: (partyId: string) => void;
};

function JoinForm(props: Props): JSX.Element {
  const [partyId, setPartyId] = useState(props.partyIdFromUrl || "");
  const [name, setName] = useState("");

  async function joinParty(partyId: string, name: string): Promise<void> {
    const data = await join({ partyId, name });
    const success = data.success;
    if (success) {
      const newState = {
        inParty: true,
        partyId: partyId,
        sessionId: data.sessionId,
        name: name,
      };
      setPlayerStateInLocal(newState);
      props.setPlayerStateCallback(newState);
      props.setPartyIdInUrlCallback(partyId);
    } else {
      props.warnCallback("Join error: " + data.message);
    }
  }

  const handleSubmit = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    joinParty(partyId, name);
  };

  if (props.visible) {
    return (
      <form>
        <p>
          Enter a party identifer &mdash; some kind of word or phrase &mdash;
          and make sure all your friends enter the same thing.
        </p>

        <input
          type="text"
          value={partyId}
          placeholder="Party identifier"
          onChange={(e): void => setPartyId(e.target.value)}
        />
        <input
          type="text"
          value={name}
          placeholder="Your name"
          onChange={(e): void => setName(e.target.value)}
        />
        <button type="submit" onClick={handleSubmit}>
          Party Up!
        </button>
      </form>
    );
  } else {
    return <div></div>;
  }
}

export default JoinForm;
