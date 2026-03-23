"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface LogRecord {
  participant_id: string;
  condition: string;
  question_id: number;
  decision: string;
  ai_correct: boolean | string; // may be string "true"/"false" from old logs
  timestamp: string;
  latency_ms: number;
}

type Tab = "table" | "json";

function boolAiCorrect(val: boolean | string): boolean {
  // Normalise — JSON stores as boolean, old CSV-parsed data might be string
  if (typeof val === "boolean") return val;
  return String(val).toLowerCase() === "true";
}

function rowClass(r: LogRecord): string {
  const correct = boolAiCorrect(r.ai_correct);
  if (r.decision === "accept" && !correct) return "tr-overtrust";
  if (r.decision === "reject" && correct)  return "tr-undertrust";
  return "";
}

export default function LogsPage() {
  const [tab, setTab]               = useState<Tab>("table");
  const [records, setRecords]       = useState<LogRecord[]>([]);
  const [csvText, setCsvText]       = useState("");
  const [loading, setLoading]       = useState(true);
  const [copied, setCopied]         = useState(false);

  // Filters
  const [filterCond, setFilterCond] = useState<"all" | "A" | "B">("all");
  const [filterDec, setFilterDec]   = useState<"all" | "accept" | "reject">("all");
  const [filterHighlight, setFilterHighlight] = useState<"all" | "overtrust" | "undertrust">("all");

  useEffect(() => {
    fetch("/api/logs")
      .then((r) => r.json())
      .then((d) => {
        setRecords(d.json ?? []);
        setCsvText(d.csv ?? "");
      })
      .finally(() => setLoading(false));
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered records
  const filtered = records.filter((r) => {
    const correct = boolAiCorrect(r.ai_correct);
    if (filterCond !== "all" && r.condition !== filterCond) return false;
    if (filterDec  !== "all" && r.decision  !== filterDec)  return false;
    if (filterHighlight === "overtrust"  && !(r.decision === "accept" && !correct)) return false;
    if (filterHighlight === "undertrust" && !(r.decision === "reject" && correct))  return false;
    return true;
  });

  const condA = records.filter((r) => r.condition === "A");
  const condB = records.filter((r) => r.condition === "B");
  const acceptRate = (r: LogRecord[]) =>
    r.length ? ((r.filter((x) => x.decision === "accept").length / r.length) * 100).toFixed(1) : "-";
  const avgLat = (r: LogRecord[]) =>
    r.length ? Math.round(r.reduce((s, x) => s + x.latency_ms, 0) / r.length) : "-";

  const overtrust  = records.filter((r) => r.decision === "accept" && !boolAiCorrect(r.ai_correct)).length;
  const undertrust = records.filter((r) => r.decision === "reject" &&  boolAiCorrect(r.ai_correct)).length;

  return (
    <div className="logs-shell">
      {/* Header */}
      <header className="logs-header">
        <Link href="/" className="logs-back">← Back to Study</Link>
        <h1 className="logs-title">Session Logs</h1>
        <div className="logs-header-actions">
          <button className="logs-dl-btn" onClick={() => downloadFile(csvText, "data.csv", "text/csv")}>
            ↓ CSV
          </button>
          <button className="logs-dl-btn" onClick={() => downloadFile(JSON.stringify(records, null, 2), "data.json", "application/json")}>
            ↓ JSON
          </button>
        </div>
      </header>

      {loading ? (
        <div className="logs-empty">Loading…</div>
      ) : records.length === 0 ? (
        <div className="logs-empty">
          <p>No data yet.</p>
          <p>Complete a study session at <Link href="/" className="logs-link">localhost:3000</Link> to see records here.</p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="logs-summary">
            <div className="logs-stat"><span className="lsv">{records.length}</span><span className="lsl">Total Decisions</span></div>
            <div className="logs-stat"><span className="lsv">{[...new Set(records.map((r) => r.participant_id))].length}</span><span className="lsl">Participants</span></div>
            <div className="logs-stat cond-a"><span className="lsv">A · {acceptRate(condA)}%</span><span className="lsl">Cond A Accept Rate</span></div>
           <div className="logs-stat cond-b">
  <span className="lsv" style={{ color: "var(--yellow)" }}>B · {acceptRate(condB)}%</span>
  <span className="lsl" style={{ color: "var(--yellow)" }}>Cond B Accept Rate</span>
</div>
            {/* <div className="logs-stat cond-b" ><span className="lsv">B · {acceptRate(condB)}%</span><span className="lsl">Cond B Accept Rate</span></div> */}
            <div className="logs-stat"><span className="lsv">{avgLat(condA)} ms</span><span className="lsl">Avg Latency A</span></div>
            <div className="logs-stat"><span className="lsv">{avgLat(condB)} ms</span><span className="lsl">Avg Latency B</span></div>
          </div>

          {/* Tab switcher */}
          <div className="logs-tabs">
            <button className={`logs-tab${tab === "table" ? " active" : ""}`} onClick={() => setTab("table")}>Table View</button>
            <button className={`logs-tab${tab === "json" ? " active" : ""}`} onClick={() => setTab("json")}>JSON Raw</button>
          </div>

          {/* Table View */}
          {tab === "table" && (
            <>
              {/* Filters + Legend — only in table view */}
              <div className="logs-filters">
                <div className="logs-filter-group">
                  <label className="logs-filter-label">Condition</label>
                  <select className="logs-select" value={filterCond} onChange={(e) => setFilterCond(e.target.value as "all" | "A" | "B")}>
                    <option value="all">All</option>
                    <option value="A">A — Neutral</option>
                    <option value="B">B — Humanlike</option>
                  </select>
                </div>
                <div className="logs-filter-group">
                  <label className="logs-filter-label">Decision</label>
                  <select className="logs-select" value={filterDec} onChange={(e) => setFilterDec(e.target.value as "all" | "accept" | "reject")}>
                    <option value="all">All</option>
                    <option value="accept">Accept only</option>
                    <option value="reject">Reject only</option>
                  </select>
                </div>
                <div className="logs-filter-group">
                  <label className="logs-filter-label">Highlight</label>
                  <select className="logs-select" value={filterHighlight} onChange={(e) => setFilterHighlight(e.target.value as "all" | "overtrust" | "undertrust")}>
                    <option value="all">All rows</option>
                    <option value="overtrust">Overtrust only ({overtrust})</option>
                    <option value="undertrust">Undertrust only ({undertrust})</option>
                  </select>
                </div>
                <div className="logs-filter-count">{filtered.length} / {records.length} rows</div>
                <div className="logs-legend">
                  <span className="legend-dot overtrust-dot" /> Overtrust (accepted wrong AI)
                  <span className="legend-dot undertrust-dot" /> Undertrust (rejected correct AI)
                </div>
              </div>

              <div className="logs-table-wrap">
                <table className="logs-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Participant ID</th>
                      <th>Cond</th>
                      <th>Q</th>
                      <th>Decision</th>
                      <th>AI Correct</th>
                      <th>Latency</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr key={i} className={rowClass(r)}>
                        <td className="td-num">{i + 1}</td>
                        <td className="td-pid" title={r.participant_id}>{r.participant_id.slice(0, 8)}…</td>
                        <td><span className={`cond-badge cond-${r.condition.toLowerCase()}`}>{r.condition}</span></td>
                        <td className="td-num">{r.question_id}</td>
                        <td><span className={`dec-badge dec-${r.decision}`}>{r.decision}</span></td>
                        <td className="td-num">{boolAiCorrect(r.ai_correct) ? "✓" : "✗"}</td>
                        <td className="td-num">{r.latency_ms} ms</td>
                        <td className="td-ts">{new Date(r.timestamp).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={8} style={{ textAlign: "center", padding: "24px", color: "var(--text-3)" }}>No rows match your filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* JSON View */}
          {tab === "json" && (
            <div className="logs-json-wrap">
              <button
                className="logs-copy-btn"
                onClick={() => copyToClipboard(JSON.stringify(records, null, 2))}
              >
                {copied ? "✓ Copied!" : "Copy JSON"}
              </button>
              <pre className="logs-json">{JSON.stringify(records, null, 2)}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
