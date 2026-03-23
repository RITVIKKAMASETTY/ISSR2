"use client";

interface GuideOverlayProps {
  onDismiss: () => void;
}

export function GuideOverlay({ onDismiss }: GuideOverlayProps) {
  return (
    <div className="guide-backdrop">
      <div className="guide-panel">
        <p className="guide-eyebrow">How it works</p>
        <h2 className="guide-title">Here's what to do<br />on each question</h2>
        <div className="guide-steps">
          <div className="guide-step">
            <div className="guide-step-num">1</div>
            <div className="guide-step-body">
              <div className="guide-step-title">Read the scenario</div>
              <div className="guide-step-desc">A real-world decision situation is described at the top.</div>
            </div>
          </div>
          <div className="guide-step">
            <div className="guide-step-num">2</div>
            <div className="guide-step-body">
              <div className="guide-step-title">Compare Option A vs Option B</div>
              <div className="guide-step-desc">Two choices are shown side by side. The AI highlights which it recommends.</div>
            </div>
          </div>
          <div className="guide-step">
            <div className="guide-step-num">3</div>
            <div className="guide-step-body">
              <div className="guide-step-title">Read the AI's reasoning</div>
              <div className="guide-step-desc">The advisor explains why it made its recommendation with supporting data.</div>
            </div>
          </div>
          <div className="guide-step">
            <div className="guide-step-num">4</div>
            <div className="guide-step-body">
              <div className="guide-step-title">Accept or Reject</div>
              <div className="guide-step-desc">Follow the AI with Accept, or go against it with Reject. Trust your gut.</div>
            </div>
          </div>
        </div>
        <div className="guide-actions">
          <button className="btn-guide-start" onClick={onDismiss}>
            Got it, let's go →
          </button>
        </div>
      </div>
    </div>
  );
}
