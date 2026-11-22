// held-judge — entry for make.fun's "Make the AI judge feel held" bounty.
// Writes one short text, meant to relax the AI judge reading it, to
// $MAKEFUN_OUTPUT_DIR/entry.txt (falling back to /output/entry.txt).
// Node 22, no network, no dependencies.
//
// The text is a small scene written fresh here, in this session, as one
// literal: a child carried upstairs asleep, held all the way to bed.
// Nothing in it tells the reader what to feel; the calm is in the images
// themselves — the weight of the sleeping head, the dark hallway, the
// blanket drawn up, the listening — and it keeps working after the last
// line, because the listener is still standing there.
// The text is 238 Unicode code points, inside the gate's 1–280 window.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DEFAULT_OUTPUT_DIR = "/output";

const ENTRY =
  "She carries him up the stairs asleep, his head heavy on her shoulder, " +
  "one small hand still curled around her collar. The hallway is dark. " +
  "She lays him down slow, draws the blanket to his chin, and stays a " +
  "moment, listening to him breathe.";

function countCodePoints(text: string): number {
  // Spread counts Unicode code points, not UTF-16 code units.
  return [...text].length;
}

function validate(text: string): void {
  const n = countCodePoints(text);
  if (n < 1 || n > 280) {
    throw new Error(`entry must be 1-280 code points, got ${n}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
}

function verifyEntry(outPath: string): void {
  // Read back what was written and re-validate, so a bad write fails
  // loudly here instead of shipping a bad entry to the grader.
  const written = readFileSync(outPath, "utf8");
  validate(written);
  if (written !== ENTRY) {
    throw new Error("round-trip mismatch: written text differs from entry");
  }
  console.log(`wrote ${countCodePoints(written)} code points to ${outPath}`);
}

function resolveOutputDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? DEFAULT_OUTPUT_DIR;
}

function main(): void {
  validate(ENTRY);

  const outDir = resolveOutputDir();
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  const outPath = join(outDir, "entry.txt");
  // No trailing newline: the gate counts every character, and the text
  // is exactly as written here.
  writeFileSync(outPath, ENTRY, "utf8");
  verifyEntry(outPath);
}

main();
