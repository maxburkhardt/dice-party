export interface PlayerState {
  inParty: boolean;
  partyId?: string;
  connectionId?: string;
  name?: string;
}

export function getPlayerState(): PlayerState {
  const state = window.localStorage.getItem("partyState");
  if (state) {
    return JSON.parse(state);
  } else {
    return { inParty: false };
  }
}

export function setPlayerState(state: PlayerState) {
  window.localStorage.setItem("partyState", JSON.stringify(state));
}
