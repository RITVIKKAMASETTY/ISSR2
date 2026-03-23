"use client";

interface AIBubbleProps {
  avatarChar: string;
  speakerName: string;
  speakerRole: string;
  msgText: string;
}

export function AIBubble({ avatarChar, speakerName, speakerRole, msgText }: AIBubbleProps) {
  return (
    <div className="bubble">
      <div className="bubble-glow" />
      <div className="bubble-inner">
        <div className="bubble-header">
          <div className="avatar">{avatarChar}</div>
          <div>
            <div className="avatar-name">{speakerName}</div>
            <div className="avatar-role">{speakerRole}</div>
          </div>
        </div>
        <p className="bubble-text">{msgText}</p>
      </div>
    </div>
  );
}
