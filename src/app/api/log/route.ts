import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";

const logsDir = path.join(process.cwd(), "logs");
const csvPath  = path.join(logsDir, "data.csv");
const jsonPath = path.join(logsDir, "data.json");

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { participant_id, condition, question_id, decision, ai_correct, latency_ms } = body;

    if (!participant_id || !condition || question_id === undefined || !decision) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const record = {
      participant_id,
      condition,
      question_id,
      decision,
      ai_correct,
      timestamp: new Date().toISOString(),
      latency_ms,
    };

    // ── 1. CSV ──────────────────────────────────────────────
    const csvExists = fs.existsSync(csvPath) && fs.statSync(csvPath).size > 0;
    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: "participant_id", title: "participant_id" },
        { id: "condition",      title: "condition"      },
        { id: "question_id",    title: "question_id"    },
        { id: "decision",       title: "decision"       },
        { id: "ai_correct",     title: "ai_correct"     },
        { id: "timestamp",      title: "timestamp"      },
        { id: "latency_ms",     title: "latency_ms"     },
      ],
      append: csvExists,
    });
    await csvWriter.writeRecords([record]);

    // ── 2. JSON ─────────────────────────────────────────────
    let existing: object[] = [];
    if (fs.existsSync(jsonPath)) {
      try {
        const raw = fs.readFileSync(jsonPath, "utf-8");
        existing = JSON.parse(raw);
      } catch {
        existing = [];
      }
    }
    existing.push(record);
    fs.writeFileSync(jsonPath, JSON.stringify(existing, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Logging error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
