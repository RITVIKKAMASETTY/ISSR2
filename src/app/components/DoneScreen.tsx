"use client";

import Link from "next/link";

interface DoneScreenProps {
  participantId: string;
  acceptCount: number;
  total: number;
  avgLatency: number;
  overtrust: number;
  undertrust: number;
}

export function DoneScreen({ participantId, acceptCount, total, avgLatency, overtrust, undertrust }: DoneScreenProps) {
  return (
    <div className="centered-shell">
      <div className="glow" />
      <div className="centered-col">
        <h1 className="done-title">Study Complete</h1>
        <p className="done-sub">
          Your responses have been saved to <code>logs/data.csv</code> and{" "}
          <code>logs/data.json</code>. Thank you for participating.
        </p>
        <div className="stats-grid">
          <div className="stat-cell"><div className="val">{acceptCount}/{total}</div><div className="lbl">Accepted</div></div>
          <div className="stat-cell"><div className="val">{avgLatency} ms</div><div className="lbl">Avg latency</div></div>
          <div className="stat-cell warn"><div className="val">{overtrust}</div><div className="lbl">Overtrust events</div></div>
          <div className="stat-cell ok"><div className="val">{undertrust}</div><div className="lbl">Undertrust events</div></div>
        </div>
        <div className="pid-label">Participant ID</div>
        <div className="pid-row">{participantId}</div>
        <Link href="/logs" className="logs-nav-link"> View Session Logs →</Link>
      </div>
    </div>
  );
}
