import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const logsDir  = path.join(process.cwd(), "logs");
const csvPath  = path.join(logsDir, "data.csv");
const jsonPath = path.join(logsDir, "data.json");

export async function GET() {
  let csvText = "";
  let jsonData: object[] = [];

  // Read CSV as raw text
  if (fs.existsSync(csvPath)) {
    csvText = fs.readFileSync(csvPath, "utf-8");
  }

  // Read JSON array
  if (fs.existsSync(jsonPath)) {
    try {
      jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    } catch {
      jsonData = [];
    }
  }

  return NextResponse.json({ csv: csvText, json: jsonData });
}
