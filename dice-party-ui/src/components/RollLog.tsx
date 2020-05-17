import React, { useState, useContext, useEffect } from "react";
import { FirebaseContext } from "./Firebase";
import {
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "@firebase/firestore-types";

export type Props = {
  partyId: string;
};

export type Roll = {
  id: string;
  partyId: string;
  roll: string;
  description: string;
  name: string;
  emoji: string;
};

function RollLog(props: Props) {
  const defaultRolls: Roll[] = [];

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

  function rollUpdater(snapshot: QuerySnapshot<DocumentData>) {
    if (!snapshot.size) {
      return;
    }
    const rolls: Roll[] = [];
    snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      rolls.push(doc.data() as Roll);
    });
    setRolls(rolls);
  }

  const [rolls, setRolls] = useState(defaultRolls);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    if (props.partyId !== "") {
      firebase?.configureRollListener(props.partyId, rollUpdater);
    } else {
      setRolls([]);
    }
  }, [firebase, props.partyId]);

  return <div className="rollLog">{rolls.map(renderRoll)}</div>;
}

export default RollLog;
