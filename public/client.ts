const flashDiv = document.getElementById("flash");
const joinForm = <HTMLFormElement>document.getElementById("joinForm");
const rollForm = <HTMLFormElement>document.getElementById("rollForm");
const leaveForm = <HTMLFormElement>document.getElementById("leaveForm");
const partyUpButton = document.getElementById("partyUp");
const rollButton = document.getElementById("roll");
const leaveButton = document.getElementById("leaveParty");
const rollLog = document.getElementById("rollLog");
const partyInfo = document.getElementById("partyInfo");
const currentParty = document.getElementById("currentParty");
const nameOutput = document.getElementById("nameOutput");
const changePartyModal = document.getElementById("changePartyModalBackground");
const leavePartyModalButton = document.getElementById("leavePartyModalButton");
const stayInPartyModalButton = document.getElementById(
  "stayInPartyModalButton"
);
const changePartyModalText = document.getElementById("changePartyModalText");

let socket = null;

function getPlayerState(): PlayerState {
  const state = window.localStorage.getItem("partyState");
  if (state) {
    return JSON.parse(state);
  } else {
    return { inParty: false, partyId: null, connectionId: null };
  }
}

function establishState() {
  const playerState = getPlayerState();
  const urlParty = partyIdFromUrl();
  if (playerState.inParty) {
    if (urlParty && urlParty !== playerState.partyId) {
      formatPartyChangeMessage(playerState.partyId, urlParty);
      changePartyModal.style.display = "block";
    } else {
      partyIdToUrl(playerState.partyId);
    }
    joinForm.style.display = "none";
    rollForm.style.display = "block";
    leaveForm.style.display = "block";
    flashDiv.style.display = "none";
    currentParty.innerText = playerState.partyId;
    nameOutput.innerText = playerState.name;
    partyInfo.style.display = "block";
    loadHistoricalRolls(playerState.partyId);
    wsConnect(playerState.connectionId);
  } else {
    if (urlParty) {
      joinForm.elements["party"].value = urlParty;
    }
    joinForm.style.display = "block";
    rollForm.style.display = "none";
    leaveForm.style.display = "none";
    flashDiv.style.display = "none";
    partyInfo.style.display = "none";
  }
}

function partyIdToUrl(partyId: string) {
  history.pushState({}, "", "/?partyId=" + partyId);
}

function partyIdFromUrl(): string {
  const urlParams = new URLSearchParams(window.location.search);
  const partyId = urlParams.get("partyId");
  return partyId;
}

function formatPartyChangeMessage(currentParty: string, linkParty: string) {
  changePartyModalText.innerText =
    `Your current party is ${currentParty}, but you just ` +
    `followed a link to join ${linkParty}. Would you like to ` +
    `leave your current party to join the new one?`;
}

function warn(message: string) {
  flashDiv.innerText = message;
  flashDiv.style.display = "block";
}

async function postData(path: string, data: any) {
  return fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(response => {
    return response.json();
  });
}

function joinParty(partyId: string, name: string) {
  postData("/join", { partyId: partyId, name: name }).then(data => {
    const success = data.success;
    if (success) {
      window.localStorage.setItem(
        "partyState",
        JSON.stringify({
          inParty: true,
          partyId: partyId,
          connectionId: data.connectionId,
          name: name
        })
      );
      establishState();
    } else {
      warn("Join error: " + data.message);
    }
  });
}

function rollDice(connectionId: string, description: string) {
  socket.send(JSON.stringify({ type: "roll", description: description }));
}

function leaveParty() {
  window.localStorage.clear();
  rollLog.innerText = "";
  // Remove socket callbacks to avoid error messages on leave
  socket.onclose = null;
  socket.onerror = null;
  socket.close();
  socket = null;
  establishState();
}

function rescueBrokenSocket(event) {
  console.log(
    "[websocket-errors] code: " +
      event.code +
      " reason: " +
      event.reason +
      " type: " +
      event.type
  );
  warn("Connection to server lost. Refreshing in 1 second...");
  setTimeout(() => location.reload(), 1000);
}

function wsConnect(connectionId: string) {
  const ws = new WebSocket(location.origin.replace("http", "ws") + "/party");
  ws.onopen = function(event) {
    ws.send(
      JSON.stringify({ type: "authentication", connectionId: connectionId })
    );
  };
  ws.onmessage = handleMessage;
  ws.onerror = rescueBrokenSocket;
  ws.onclose = rescueBrokenSocket;
  socket = ws;
}

function pushRollMessage(message: RollMessage) {
  const rollText =
    message.emoji +
    " " +
    message.name +
    ": " +
    JSON.parse(message.roll)
      .map(die => die[1] + " on a d" + die[0])
      .join(", ");
  const p = document.createElement("p");
  p.innerText = rollText;
  const descSpan = document.createElement("span");
  descSpan.setAttribute("class", "italic");
  descSpan.innerText = message.description;
  p.append(document.createElement("br"));
  p.append(descSpan);
  rollLog.prepend(p);
}

function pushMembershipMessage(message: MembershipMessage) {
  const text =
    message.emoji + " " + message.name + " " + message.verb + " the party.";
  const p = document.createElement("p");
  p.setAttribute("class", "italic");
  p.innerText = text;
  rollLog.prepend(p);
}

function handleMessage(event) {
  const parsed = <WsMessage>JSON.parse(event.data);
  switch (parsed.type) {
    case "roll":
      pushRollMessage(<RollMessage>parsed.data);
      break;
    case "membership":
      pushMembershipMessage(<MembershipMessage>parsed.data);
      break;
    case "info":
      console.log((<InfoMessage>parsed.data).info);
      break;
    case "error":
      warn((<ErrorMessage>parsed.data).error);
      break;
  }
}

async function loadHistoricalRolls(partyId: string) {
  const data = await postData("/history", { partyId: partyId });
  if (!data.success) {
    warn("Couldn't get historical rolls.");
  }
  data.rolls.map(roll => {
    pushRollMessage(roll);
  });
}

partyUpButton.addEventListener(
  "click",
  function(event) {
    event.preventDefault();
    joinParty(
      joinForm.elements["party"].value,
      joinForm.elements["name"].value
    );
  },
  false
);

rollButton.addEventListener(
  "click",
  function(event) {
    event.preventDefault();
    rollDice(
      JSON.parse(window.localStorage.getItem("partyState")).connectionId,
      rollForm.elements["description"].value
    );
    rollForm.elements["description"].value = "";
  },
  false
);

leaveButton.addEventListener(
  "click",
  function(event) {
    event.preventDefault();
    leaveParty();
  },
  false
);

leavePartyModalButton.addEventListener(
  "click",
  function(event) {
    event.preventDefault();
    changePartyModal.style.display = "none";
    leaveParty();
  },
  false
);

stayInPartyModalButton.addEventListener(
  "click",
  function(event) {
    event.preventDefault();
    changePartyModal.style.display = "none";
    partyIdToUrl(getPlayerState().partyId);
  },
  false
);

establishState();
