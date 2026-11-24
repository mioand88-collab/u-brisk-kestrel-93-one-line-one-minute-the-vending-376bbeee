// One Line, One Minute: The Vending Machine Pickup Line Contest
// main.ts — writes a single pickup line, spoken by a vending machine,
// to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt when set).
// Run with Node 22.18+ as: node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line itself: the machine speaking, in its own world — coils, hum,
// buttons, exact change — with the turn landing in the last few words.
const LINE =
  "I only drop snacks for people worth waiting for — and you just made my hum skip a beat. Press B3: exact change optional, your smile isn’t.";

function outputDir(): string {
  const env = process.env.MAKEFUN_OUTPUT_DIR;
  return env && env.trim().length > 0 ? env : "/output";
}

// One guard per gate rule, so a failure names exactly the rule it broke.
function guardLength(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`line must be 1-200 characters, got ${line.length}`);
  }
}

function guardSingleLine(line: string): void {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be a single line");
  }
}

function guardNonWhitespace(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
}

function validate(line: string): void {
  guardLength(line);
  guardSingleLine(line);
  guardNonWhitespace(line);
}

function main(): void {
  // Gate: the entry must be 1–200 characters, a single line, non-whitespace.
  validate(LINE);

  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  writeFileSync(target, LINE, "utf8");

  // Verify what was written: read it back and confirm it is exactly the
  // validated line, so a failed or partial write can never slip through.
  const written = readFileSync(target, "utf8");
  if (written !== LINE) {
    throw new Error("entry.txt does not match the validated line");
  }
  validate(written);
}

main();
