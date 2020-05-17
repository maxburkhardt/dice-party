import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import {
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "@firebase/firestore-types";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

export type Roll = {
  id: string;
  partyId: string;
  roll: string;
  description: string;
  name: string;
  emoji: string;
};

export default class Firebase {
  private db: firebase.firestore.Firestore;
  private auth: firebase.auth.Auth;
  private rollListenerUnsubscribe?: () => void;

  constructor() {
    firebase.initializeApp(config);
    this.db = firebase.firestore();
    this.auth = firebase.auth();
  }

  async authenticate(token: string): Promise<void> {
    await this.auth.signInWithCustomToken(token);
  }

  signOut(): void {
    this.auth.signOut();
  }

  configureRollListener(
    partyId: string,
    renderer: (rolls: Roll[]) => void
  ): void {
    this.rollListenerUnsubscribe = this.db
      .collection("rolls")
      .where("partyId", "==", partyId)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot: QuerySnapshot<DocumentData>) => {
        const rolls: Roll[] = [];
        if (!snapshot.size) {
          return;
        }
        snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          rolls.push(doc.data() as Roll);
        });
        renderer(rolls);
      });
  }

  disconnectRollListener(): void {
    if (this.rollListenerUnsubscribe) {
      this.rollListenerUnsubscribe();
    }
  }
}
