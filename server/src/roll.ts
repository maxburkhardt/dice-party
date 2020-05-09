import { randomBytes } from "crypto";

// Produce a number from 0 to (sides - 1)
export function die(sides: number): number {
  const bytes = randomBytes(4);
  const num = bytes.readUInt32BE();
  const pct = num / 4294967295;
  return Math.floor(pct * sides) + 1;
}

// diceSpec is an array of ints, e.g. [6, 10, 10]
export function generate(diceSpec: number[]): number[][] {
  return diceSpec.map((sides) => [sides, die(sides)]);
}
