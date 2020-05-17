export interface PlayerState {
  inParty: boolean;
  partyId?: string;
  sessionId?: string;
  name?: string;
}

export function getPlayerStateFromLocal(): PlayerState {
  const state = window.localStorage.getItem("partyState");
  if (state) {
    return JSON.parse(state);
  } else {
    return { inParty: false };
  }
}

export function setPlayerStateInLocal(state: PlayerState): void {
  window.localStorage.setItem("partyState", JSON.stringify(state));
}
