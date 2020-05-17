import React, { useState } from "react";
import { roll } from "../partyApi";

export type Props = {
  visible: boolean;
  partyId?: string;
  sessionId?: string;
  name?: string;
  warnCallback: (message: string) => void;
};

function RollForm(props: Props): JSX.Element {
  const [description, setDescription] = useState("");

  async function handleRoll(event: React.SyntheticEvent): Promise<void> {
    event.preventDefault();
    setDescription("");
    if (props.sessionId !== undefined) {
      const sessionId = props.sessionId;
      const response = await roll({ sessionId, description });
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
