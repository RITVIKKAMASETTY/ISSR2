import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.DATABASE_URL || "";
  return NextResponse.json({
    len: url.length,
    firstChar: url.charCodeAt(0),
    lastChar: url.charCodeAt(url.length - 1),
    secondLast: url.charCodeAt(url.length - 2),
    raw: JSON.stringify(url)
  });
}
