import { NextResponse } from "next/server";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

export async function GET() {
  const url = process.env.DATABASE_URL;
  if (!url) return NextResponse.json({ error: "no url" });

  try {
    const pool = new Pool({ connectionString: url });
    const { rows } = await pool.query("SELECT 1 as result");
    return NextResponse.json({ success: true, rows, urlLength: url.length });
  } catch (err: any) {
    return NextResponse.json({
      error: err.message,
      urlLength: url.length,
      urlPrefix: url.substring(0, 15),
    });
  }
}
