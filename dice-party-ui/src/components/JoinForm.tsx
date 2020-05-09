import React, { useState } from "react";
import { setPlayerState } from "../localState";

export type Props = {
  visible: boolean;
  warnCallback: (message: string) => void;
};

async function postData(path: string, data: any) {
  return fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    return response.json();
  });
}

function joinParty(
  partyId: string,
  name: string,
  warnCallback: (message: string) => void
) {
  postData("/join", { partyId: partyId, name: name }).then((data) => {
    const success = data.success;
    if (success) {
      setPlayerState({
        inParty: true,
        partyId: partyId,
        connectionId: data.connectionId,
        name: name,
      });
    } else {
      warnCallback("Join error: " + data.message);
    }
  });
}

function JoinForm(props: Props) {
  const [partyId, setPartyId] = useState("");
  const [name, setName] = useState("");
  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    joinParty(partyId, name, props.warnCallback);
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
          onChange={(e) => setPartyId(e.target.value)}
        />
        <input
          type="text"
          value={name}
          placeholder="Your name"
          onChange={(e) => setName(e.target.value)}
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
