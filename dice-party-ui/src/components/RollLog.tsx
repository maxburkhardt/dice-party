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
    const parsedRoll = JSON.parse(roll.roll) as [number, number][];
    // d6 + bonus
    const actionTotal =
      parsedRoll.filter((dieResult) => dieResult[0] === 6)[0][1] + roll.bonus;
    // array of the numbers rolled on the d10s
    const challengeDice = parsedRoll
      .filter((dieResult) => dieResult[0] === 10)
      .map((dieResult) => dieResult[1]);
    // count of challenge dice overcome
    const successes = challengeDice.reduce(
      (cumulative, thisResult) =>
        cumulative + (thisResult < actionTotal ? 1 : 0),
      0
    );
    let resultText = "";
    if (successes === 0) {
      resultText = "⤑ Miss!";
    } else if (successes === 1) {
      resultText = "⤑ Weak Hit";
    } else if (successes === 2) {
      resultText = "⤑ Strong Hit!";
    }

    const nameText = `${roll.emoji} ${roll.name}:`;
    return (
      <p key={roll.id}>
        {nameText} <span className="italic">{roll.description}</span>
        <br />
        {parsedRoll.map((dieResult: [number, number], index) => (
          <span key={index} className={`die-${dieResult[0]}`}>
            {dieResult[1]}
          </span>
        ))}
        {resultText} (bonus: {roll.bonus})
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
