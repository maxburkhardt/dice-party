import firebase from "firebase/app";
import "firebase/firestore";
import { QuerySnapshot, DocumentData } from "@firebase/firestore-types";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

export default class Firebase {
  private db: firebase.firestore.Firestore;

  constructor() {
    firebase.initializeApp(config);
    this.db = firebase.firestore();
  }

  configureRollListener(
    partyId: string,
    renderer: (snapshot: QuerySnapshot<DocumentData>) => void
  ): void {
    this.db
      .collection("rolls")
      .where("partyId", "==", partyId)
      .orderBy("timestamp", "desc")
      .onSnapshot(renderer);
  }
}
