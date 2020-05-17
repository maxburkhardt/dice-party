type Party = {
  id: string;
  startTime: number;
};

type Session = {
  id: string;
  partyId: string;
  emoji: string;
  name: string;
};

type Roll = {
  id: string;
  partyId: string;
  roll: string;
  description: string;
  bonus: number;
  name: string;
  emoji: string;
  timestamp: number;
};

type DiceModifierSpec = {
  [key: string]: string;
};

type DiceSelectionSpec = string[][];
