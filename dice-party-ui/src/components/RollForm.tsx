import React, { useState, useContext } from "react";
import { PartyApiContext } from "./PartyApi";

export type Props = {
  visible: boolean;
  partyId?: string;
  sessionId?: string;
  name?: string;
  warnCallback: (message: string) => void;
};

function RollForm(props: Props): JSX.Element {
  const [description, setDescription] = useState("");
  const partyApi = useContext(PartyApiContext);

  async function handleRoll(event: React.SyntheticEvent): Promise<void> {
    event.preventDefault();
    if (partyApi === null) {
      console.log("Couldn't roll because party API client is null");
      return;
    }
    setDescription("");
    if (props.sessionId !== undefined) {
      const sessionId = props.sessionId;
      const response = await partyApi.roll({ sessionId, description });
      if (!response.success) {
        props.warnCallback(response.message || "Unknown roll error");
      }
    }
  }

  if (props.visible) {
    return (
      <form>
        <p>
          Current party: {props.partyId}
          <br />
          Your name: {props.name}
        </p>
        <input
          name="description"
          type="text"
          maxLength={280}
          placeholder="Roll description"
          autoFocus={true}
          value={description}
          onChange={(e): void => setDescription(e.target.value)}
        />
        <button type="submit" onClick={handleRoll}>
          Roll!
        </button>
      </form>
    );
  } else {
    return <div></div>;
  }
}

export default RollForm;
