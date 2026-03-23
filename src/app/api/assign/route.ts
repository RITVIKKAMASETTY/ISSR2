import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const logsDir     = path.join(process.cwd(), "logs");
const counterPath = path.join(logsDir, "counter.json");

if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

export async function GET() {
  // Read current participant count (persisted across sessions)
  let count = 0;
  if (fs.existsSync(counterPath)) {
    try {
      count = JSON.parse(fs.readFileSync(counterPath, "utf-8")).count ?? 0;
    } catch {
      count = 0;
    }
  }

  // Strict alternation: even → A, odd → B
  const condition: "A" | "B" = count % 2 === 0 ? "A" : "B";
  const participantId = uuidv4();

  // Persist incremented count immediately (atomic within Node single-thread)
  fs.writeFileSync(counterPath, JSON.stringify({ count: count + 1 }), "utf-8");

  return NextResponse.json({
    participantId,
    condition,
    participantNumber: count + 1,
  });
}
