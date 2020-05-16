import React, { useState } from "react";
import { roll } from "../partyApi";

export type Props = {
  visible: boolean;
  partyId: string;
  sessionId: string;
  name: string;
  warnCallback: (message: string) => void;
};

function RollForm(props: Props) {
  const [description, setDescription] = useState("");

  async function handleRoll(event: React.SyntheticEvent) {
    event.preventDefault();
    const response = await roll(props.sessionId, description);
    if (!response.success) {
      props.warnCallback(response.message || "Unknown roll error");
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
          onChange={(e) => setDescription(e.target.value)}
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
