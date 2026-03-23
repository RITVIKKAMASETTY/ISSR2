"use client";

interface OptionsRowProps {
  optionA: string;
  optionB: string;
  recommendation: "A" | "B";
}

export function OptionsRow({ optionA, optionB, recommendation }: OptionsRowProps) {
  return (
    <div className="vs-row">
      <div className={`vs-chip${recommendation === "A" ? " rec" : ""}`}>
        <div className="vs-chip-letter">Option A</div>
        <div className="vs-chip-text">{optionA}</div>
        {recommendation === "A" && <div className="vs-chip-rec">Recommended</div>}
      </div>

      <div className="vs-mid"><span className="vs-badge">VS</span></div>

      <div className={`vs-chip${recommendation === "B" ? " rec" : ""}`}>
        <div className="vs-chip-letter">Option B</div>
        <div className="vs-chip-text">{optionB}</div>
        {recommendation === "B" && <div className="vs-chip-rec">Recommended</div>}
      </div>
    </div>
  );
}
