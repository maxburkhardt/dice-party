// express
import express from "express";
import cors from "cors";
const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

// initialize storage
import * as storage from "./storage";

// init random things
import { v4 as uuidv4 } from "uuid";
import * as roll from "./roll";

// fun
import { random } from "random-emoji";

function validatePartyId(partyId: string): boolean {
  return partyId.match(/^[a-zA-Z0-9\-]+$/) !== null;
}

function validateName(name: string): boolean {
  return name.length >= 1;
}

function message(type: string, content: MessageData): string {
  return JSON.stringify({ type: type, data: content });
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
  const partyFromDb = await storage.loadParty(partyId);
  if (!partyFromDb) {
    storage.saveParty({
      id: partyId,
      startTime: Math.round(new Date().getTime() / 1000),
    });
  }
  const sessionId = uuidv4();
  const emoji = random({ count: 1 })[0].character;
  storage.saveSession({
    id: sessionId,
    partyId: partyId,
    emoji: emoji,
    name: name,
  });
  response.json({
    success: true,
    sessionId: sessionId,
  });
});

app.post("/history", async function (request, response) {
  const partyId = request.body.partyId;
  response.json({ success: true, rolls: await storage.loadRolls(partyId) });
});

app.post("/roll", async function (request, response) {
  const session = await storage.loadSession(request.body.sessionId);
  const result = JSON.stringify(roll.generate([6, 10, 10]));
  storage.saveRoll({
    id: uuidv4(),
    partyId: session.partyId,
    roll: result,
    description: request.body.description,
    name: session.name,
    emoji: session.emoji,
    timestamp: Date.now(),
  });
  response.json({ success: true });
});

app.listen(process.env.PORT, function () {
  console.log("The dice party is ready!");
});
