import { initializeApp, firestore, credential } from "firebase-admin";

initializeApp({ credential: credential.applicationDefault() });
const db = firestore();

const partyCollection = db.collection("parties");
const sessionCollection = db.collection("sessions");
const rollCollection = db.collection("rolls");

export async function loadParty(partyId: string): Promise<Party> {
  return (await partyCollection.doc(partyId).get()).data() as Party;
}

export function saveParty(party: Party): void {
  partyCollection.doc(party.id).set(party);
}

export async function loadSession(sessionId: string): Promise<Session> {
  return (await sessionCollection.doc(sessionId).get()).data() as Session;
}

export function saveSession(session: Session): void {
  sessionCollection.doc(session.id).set(session);
}

export async function loadRolls(partyId: string): Promise<Roll[]> {
  const rolls: Roll[] = [];
  (await rollCollection.where("partyId", "==", partyId).get()).forEach((doc) =>
    rolls.push(doc.data() as Roll)
  );
  return rolls;
}

export function saveRoll(roll: Roll): void {
  rollCollection.doc(roll.id).set(roll);
}
