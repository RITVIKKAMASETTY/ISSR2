"use client";

interface ActionBarProps {
  questionId: number;
  busy: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export function ActionBar({ questionId, busy, onAccept, onReject }: ActionBarProps) {
  return (
    <div className="page-footer">
      <div className="action-row">
        <button
          id={`btn-accept-q${questionId}`}
          className="btn btn-accept"
          onClick={onAccept}
          disabled={busy}
        >
          {busy ? (
            <><span className="spinner"></span> Saving</>
          ) : (
            <><span>✓</span> Accept</>
          )}
        </button>
        <button
          id={`btn-reject-q${questionId}`}
          className="btn btn-reject"
          onClick={onReject}
          disabled={busy}
        >
          {busy ? (
            <><span className="spinner"></span> Saving</>
          ) : (
            <><span>✗</span> Reject</>
          )}
        </button>
      </div>
    </div>
  );
}
