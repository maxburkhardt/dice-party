import React, { useState, useContext, useEffect } from "react";
import { FirebaseContext } from "./Firebase";
import { Roll } from "./Firebase/firebase";

export type Props = {
  partyId?: string;
};

function RollLog(props: Props): JSX.Element {
  const defaultRolls: Roll[] = [];
  const [rolls, setRolls] = useState(defaultRolls);
  const firebase = useContext(FirebaseContext);

  function renderRoll(roll: Roll): JSX.Element {
    const rollString = JSON.parse(roll.roll)
      .map((die: [number, number]) => die[1] + " on a d" + die[0])
      .join(", ");
    const rollText = `${roll.emoji} ${roll.name}: ${rollString}`;
    return (
      <p key={roll.id}>
        {rollText}
        <br />
        <span className="italic">{roll.description}</span>
      </p>
    );
  }

  function rollUpdater(rolls: Roll[]): void {
    setRolls(rolls);
  }

  useEffect(() => {
    if (props.partyId !== undefined) {
      firebase?.configureRollListener(props.partyId, rollUpdater);
    } else {
      setRolls([]);
    }
  }, [firebase, props.partyId]);

  return <div className="rollLog">{rolls.map(renderRoll)}</div>;
}

export default RollLog;
