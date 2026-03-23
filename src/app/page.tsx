"use client";

import { useEffect, useState, useCallback } from "react";
import { questions, type Question } from "./data/questions";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { DoneScreen } from "./components/DoneScreen";
import { GuideOverlay } from "./components/GuideOverlay";
import { TaskHeader } from "./components/TaskHeader";
import { OptionsRow } from "./components/OptionsRow";
import { AIBubble } from "./components/AIBubble";
import { ActionBar } from "./components/ActionBar";

type Phase = "welcome" | "task" | "done";

interface LocalLog {
  question_id: number;
  decision: "accept" | "reject";
  ai_correct: boolean;
  latency_ms: number;
}

export default function Home() {
  const [phase, setPhase]                 = useState<Phase>("welcome");
  const [theme, setTheme]                 = useState<"light" | "dark">("light");
  const [participantId, setParticipantId] = useState("");
  const [condition, setCondition]         = useState<"A" | "B">("A");
  const [index, setIndex]                 = useState(0);
  const [qStart, setQStart]               = useState(0);
  const [logs, setLogs]                   = useState<LocalLog[]>([]);
  const [busy, setBusy]                   = useState(false);
  const [showGuide, setShowGuide]         = useState(true);

  // Sync dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Balanced A/B assignment from server
  useEffect(() => {
    fetch("/api/assign")
      .then((r) => r.json())
      .then((d) => { setParticipantId(d.participantId); setCondition(d.condition); })
      .catch(() => { setParticipantId(crypto.randomUUID()); setCondition(Math.random() < 0.5 ? "A" : "B"); });
  }, []);

  const begin = () => setPhase("task");

  const dismissGuide = () => {
    setShowGuide(false);
    setQStart(Date.now()); // Q1 latency starts AFTER guide is read
  };

  const decide = useCallback(
    async (decision: "accept" | "reject") => {
      if (busy) return;
      setBusy(true);

      const latency_ms = Date.now() - qStart;
      const q: Question = questions[index];

      fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant_id: participantId, condition, question_id: q.id, decision, ai_correct: q.ai_correct, latency_ms }),
      }).catch(console.error);

      setLogs((prev) => [...prev, { question_id: q.id, decision, ai_correct: q.ai_correct, latency_ms }]);

      const next = index + 1;
      if (next >= questions.length) { setPhase("done"); }
      else { setIndex(next); setQStart(Date.now()); }

      setBusy(false);
    },
    [busy, qStart, index, participantId, condition]
  );

  // Derived stats for done screen 
  const acceptCount = logs.filter((l) => l.decision === "accept").length;
  const overtrust   = logs.filter((l) => l.decision === "accept" && !l.ai_correct).length;
  const undertrust  = logs.filter((l) => l.decision === "reject" && l.ai_correct).length;
  const avgLatency  = logs.length ? Math.round(logs.reduce((s, l) => s + l.latency_ms, 0) / logs.length) : 0;
  const progress    = (index / questions.length) * 100;

  //Welcome 
  if (phase === "welcome") return <WelcomeScreen onBegin={begin} />;

  // Done 
  if (phase === "done") return (
    <DoneScreen
      participantId={participantId}
      acceptCount={acceptCount}
      total={logs.length}
      avgLatency={avgLatency}
      overtrust={overtrust}
      undertrust={undertrust}
    />
  );

  // Task
  const q           = questions[index];
  const isA         = condition === "A";
  const speakerName = isA ? "AI" : "Emma";
  const speakerRole = isA ? "AI Assistant" : "AI Advisor · Emma";
  const avatarChar  = isA ? "AI" : "Em";
  const msgText     = (isA ? q.conditionA_msg : q.conditionB_msg)
                        .replace(/^(AI Assistant|Emma):\s*"?/, "").replace(/"$/, "");

  return (
    <>
      {showGuide && <GuideOverlay onDismiss={dismissGuide} />}

      <TaskHeader
        current={index + 1}
        total={questions.length}
        progress={progress}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      />

      <main className="page-body">
        <div className="page-col">
          <p className="scenario-label">Scenario {q.id}</p>
          <p className="scenario-text">{q.scenario}</p>

          <OptionsRow
            optionA={q.optionA}
            optionB={q.optionB}
            recommendation={q.recommendation}
          />

          <div className="rule" />

          <AIBubble
            avatarChar={avatarChar}
            speakerName={speakerName}
            speakerRole={speakerRole}
            msgText={msgText}
          />
        </div>
      </main>

      <ActionBar
        questionId={q.id}
        busy={busy}
        onAccept={() => decide("accept")}
        onReject={() => decide("reject")}
      />
    </>
  );
}
