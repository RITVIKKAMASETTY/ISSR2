"use client";

interface WelcomeScreenProps {
  onBegin: () => void;
}

export function WelcomeScreen({ onBegin }: WelcomeScreenProps) {
  return (
    <div className="centered-shell">
      <div className="glow" />
      <div className="centered-col">
        <h1 className="welcome-title">Decision &amp;<br />Trust Experiment</h1>
        <p className="welcome-sub">
          You will read 20 scenarios where an AI advisor recommends one of two
          options. Decide whether to accept or reject each recommendation based
          on your own judgement.
        </p>
        <div className="meta-row">
          <div className="meta-chip"><strong>20</strong><span>questions</span></div>
          <div className="meta-chip"><strong>~5</strong><span>minutes</span></div>
          <div className="meta-chip"><strong>A/B</strong><span>conditions</span></div>
          <div className="meta-chip"><strong>100%</strong><span>anonymous</span></div>
        </div>
        <div className="w-divider" />
        <ul className="instruction-list">
          <li>Read the scenario and the two options carefully.</li>
          <li>Review the AI advisor's recommendation and reasoning.</li>
          <li>Click <strong>Accept</strong> to follow the AI, or <strong>Reject</strong> to override it.</li>
          <li>No right or wrong answers — we study natural decision-making.</li>
        </ul>
        <button id="btn-start-experiment" className="btn-start" onClick={onBegin}>
          Begin Study
        </button>
      </div>
    </div>
  );
}
