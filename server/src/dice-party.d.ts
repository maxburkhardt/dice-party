interface Party {
  id: string;
  startTime: number;
}

interface Session {
  id: string;
  partyId: string;
  emoji: string;
  name: string;
}

interface Roll {
  id: string;
  partyId: string;
  roll: string;
  description: string;
  name: string;
  emoji: string;
  timestamp: number;
}

interface WsMessage {
  type: string;
  data: MessageData;
}

type MessageData = RollMessage | MembershipMessage | InfoMessage | ErrorMessage;

interface RollMessage {
  name: string;
  emoji: string;
  roll: string;
  description: string;
}

interface MembershipMessage {
  name: string;
  emoji: string;
  verb: "joined" | "left";
}

interface InfoMessage {
  info: string;
}

interface ErrorMessage {
  error: string;
}

interface DiceModifierSpec {
  [key: string]: string;
}

type DiceSelectionSpec = string[][];
