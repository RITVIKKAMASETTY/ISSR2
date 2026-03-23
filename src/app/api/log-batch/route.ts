import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { participant_id, condition, events } = await req.json();

    if (!participant_id || !condition || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Create the session
    const session = await prisma.session.create({
      data: {
        participant_id,
        condition,
      },
    });

    // 2. Batch insert all 20 decision events
    const eventData = events.map((ev: any) => ({
      participant_id,
      condition,
      question_id: ev.question_id,
      decision: ev.decision,
      ai_correct: ev.ai_correct,
      timestamp: new Date(ev.timestamp),
      latency_ms: ev.latency_ms,
    }));

    await prisma.decisionEvent.createMany({
      data: eventData,
    });

    return NextResponse.json({ success: true, session_id: session.id, events_count: eventData.length });
  } catch (error) {
    console.error("Batch log error:", error);
    return NextResponse.json({ error: "Failed to batch log" }, { status: 500 });
  }
}
