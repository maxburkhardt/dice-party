// Set up firebase
import { initializeApp, credential, auth } from "firebase-admin";
initializeApp({ credential: credential.applicationDefault() });

import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { random } from "random-emoji";
import {
  loadParty,
  saveParty,
  saveSession,
  saveRoll,
  loadSession,
} from "./storage";
import { generate } from "./roll";

// Set up express
const app = express();
app.use(express.json());

const corsOrigins = new Set([
  "https://dice-party-276102.web.app",
  "https://thedice.party",
  "https://join.thedice.party",
  "http://localhost:3000",
]);
const corsOptions = {
  origin: function (
    origin: string,
    callback: (error: Error | null, allowed?: boolean) => void
  ): void {
    if (corsOrigins.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS rejected origin ${origin}`));
    }
  },
};
app.use(cors(corsOptions));

function validatePartyId(partyId: string): boolean {
  return partyId.match(/^[a-zA-Z0-9\-]+$/) !== null;
}

function validateName(name: string): boolean {
  return name.length >= 1;
}

app.get("/", function (request, response) {
  response.send("Welcome to the dice party!");
});

app.post("/join", async function (request, response) {
  const partyId = request.body.partyId;
  const name = request.body.name;
  if (!validatePartyId(partyId)) {
    response.json({
      success: false,
      message: "Party ID must be alphanumeric (hyphens are allowed).",
    });
    return;
  }
  if (!validateName(name)) {
    response.json({
      success: false,
      message: "Your name must be at least one character long.",
    });
    return;
  }
  const partyFromDb = await loadParty(partyId);
  const firebaseToken = await auth().createCustomToken(partyId);
  if (!partyFromDb) {
    saveParty({
      id: partyId,
      startTime: Math.round(new Date().getTime() / 1000),
    });
  }
  const sessionId = uuidv4();
  const emoji = random({ count: 1 })[0].character;
  saveSession({
    id: sessionId,
    partyId: partyId,
    emoji: emoji,
    name: name,
  });
  response.json({
    success: true,
    sessionId: sessionId,
    authToken: firebaseToken,
  });
});

app.post("/roll", async function (request, response) {
  const session = await loadSession(request.body.sessionId);
  const result = JSON.stringify(generate([6, 10, 10]));
  saveRoll({
    id: uuidv4(),
    partyId: session.partyId,
    roll: result,
    description: request.body.description,
    bonus: request.body.bonus,
    name: session.name,
    emoji: session.emoji,
    timestamp: Date.now(),
  });
  response.json({ success: true });
});

app.listen(process.env.PORT, function () {
  console.log("The dice party is ready!");
});
