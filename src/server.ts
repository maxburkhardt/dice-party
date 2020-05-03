// express
import express from "express";
import expressWs from "express-ws";
import WsWebSocket from "ws";
const { app } = expressWs(express());
app.use(express.json());
app.use(express.static("public"));

// initialize storage
import * as storage from "./storage";

// init random things
import { v4 as uuidv4 } from "uuid";
import * as roll from "./roll";

// fun
import { random } from "random-emoji";

// keep an index of party -> socket for fast broadcasts
const partyConnections: Map<string, WsWebSocket[]> = new Map();

function validatePartyId(partyId: string): boolean {
  return partyId.match(/^[a-zA-Z0-9\-]+$/) !== null;
}

function validateName(name: string): boolean {
  return name.length >= 1;
}

function message(type: string, content: MessageData): string {
  return JSON.stringify({ type: type, data: content });
}

function partyBroadcast(partyId: string, message: string) {
  const partyMembers = partyConnections.get(partyId);
  if (partyMembers) {
    partyMembers.map((ws) => {
      if (ws.readyState === 1) {
        ws.send(message);
      }
    });
  }
}

function cleanPartyConnections() {
  for (let [partyId, connections] of partyConnections) {
    const validConnections = [];
    for (let connection of connections) {
      if (connection.readyState === 1) {
        validConnections.push(connection);
      }
    }
    const cleanupSize = connections.length - validConnections.length;
    partyConnections.set(partyId, validConnections);
    if (cleanupSize !== 0) {
      console.log(
        "Party connection cleaner removed " +
          cleanupSize +
          " entries for party " +
          partyId
      );
      console.log(
        "Party " + partyId + " now has " + validConnections.length + " entries"
      );
    }
  }
}

app.get("/", function (request, response) {
  const xForwardedProtoHeader = request.headers["x-forwarded-proto"];
  let xForwardedProto = "";
  if (xForwardedProtoHeader instanceof Array) {
    xForwardedProto = xForwardedProtoHeader[0];
  } else {
    xForwardedProto = xForwardedProtoHeader;
  }
  if (!xForwardedProto.startsWith("https")) {
    response.redirect(
      301,
      "https://" + request.headers["x-forwarded-host"] + "/"
    );
  } else {
    response.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    response.sendFile(__dirname + "/views/index.html");
  }
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
  const connectionId = uuidv4();
  const emoji = random({ count: 1 })[0].character;
  storage.saveConnection({
    id: connectionId,
    partyId: partyId,
    emoji: emoji,
    name: name,
  });
  response.json({
    success: true,
    connectionId: connectionId,
  });
});

app.post("/history", async function (request, response) {
  const partyId = request.body.partyId;
  response.json({ success: true, rolls: await storage.loadRolls(partyId) });
});

app.ws("/party", function (ws, response) {
  ws.send(message("info", { info: "Welcome to the dice party!" }));
  // Create variables local to this object that will be used for connection tracking
  let connectionId = null;
  let partyId = null;
  let name = null;
  let emoji = null;
  ws.on("message", async function (msg) {
    const data = JSON.parse(msg.toString());
    if (data.type !== "authentication" && connectionId === null) {
      ws.send(message("error", { error: "Not authenticated yet!" }));
      return;
    }
    switch (data.type) {
      case "authentication":
        connectionId = data.connectionId;
        const connectionDetails = await storage.loadConnection(connectionId);
        if (connectionDetails) {
          partyId = connectionDetails.partyId;
          name = connectionDetails.name;
          emoji = connectionDetails.emoji;
          const otherPartyEntries = partyConnections.get(partyId);
          if (otherPartyEntries) {
            otherPartyEntries.push(ws);
          } else {
            partyConnections.set(connectionDetails.partyId, [ws]);
          }
          // Uncomment the following to get "join" messages for users
          // Disabled because Glitch WS instabilty makes these spammy
          /*
          partyBroadcast(
            partyId,
            message("membership", { name: name, emoji: emoji, verb: "joined" })
          );
          */
        } else {
          ws.send(
            message("error", {
              error: "Connection ID not found. Please leave and rejoin.",
            })
          );
          ws.close();
        }
        break;
      case "roll":
        const result = JSON.stringify(roll.generate([6]));
        storage.saveRoll({
          id: uuidv4(),
          partyId: partyId,
          connectionId: connectionId,
          roll: result,
          description: data.description,
        });
        partyBroadcast(
          partyId,
          message("roll", {
            name: name,
            emoji: emoji,
            roll: result,
            description: data.description,
          })
        );
        break;
    }
  });

  // Uncomment the following to get "leave" messages for users
  // These don't work great because often connections will close without a
  // user actually leaving, leading to confusion.
  /*
  ws.on("close", function(code, reason) {
    if (partyId) {
      partyBroadcast(
        partyId,
        message("membership", { name: name, emoji: emoji, verb: "left" })
      );
    }
  });
  */
});

var listener = app.listen(process.env.PORT, function () {
  console.log("The dice party is ready!");
});

// Set up cleaner for partyConnections
setInterval(cleanPartyConnections, 30000);
