import { initializeApp, firestore, credential } from "firebase-admin";

initializeApp({ credential: credential.applicationDefault() });
const db = firestore();

const partyCollection = db.collection("parties");
const connectionCollection = db.collection("connections");
const rollCollection = db.collection("rolls");

export async function loadParty(partyId: string): Promise<Party> {
  return (await partyCollection.doc(partyId).get()).data() as Party;
}

export function saveParty(party: Party) {
  partyCollection.doc(party.id).set({ startTime: party.startTime });
}

export async function loadConnection(
  connectionId: string
): Promise<Connection> {
  return (await partyCollection.doc(connectionId).get()).data() as Connection;
}

export function saveConnection(connection: Connection) {
  connectionCollection.doc(connection.id).set({
    partyId: connection.partyId,
    emoji: connection.emoji,
    name: connection.name,
  });
}

export async function loadRolls(partyId: string): Promise<Roll[]> {
  const rolls: Roll[] = [];
  (await rollCollection.where("partyId", "==", partyId).get()).forEach((doc) =>
    rolls.push(doc.data() as Roll)
  );
  return rolls;
}

export function saveRoll(roll: Roll) {
  rollCollection.doc(roll.id).set({
    connectionId: roll.connectionId,
    roll: roll.roll,
    description: roll.description,
  });
}
