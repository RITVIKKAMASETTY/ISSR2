"use client";

interface TaskHeaderProps {
  current: number;
  total: number;
  progress: number;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function TaskHeader({ current, total, progress, theme, onToggleTheme }: TaskHeaderProps) {
  return (
    <>
      <header className="page-header">
        <div className="page-header-logo">
          <span className="logo-dot" />
          AI Trust Study
        </div>
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            title="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <span className="page-header-step">{current} / {total}</span>
        </div>
      </header>

      <div className="page-progress">
        <div className="page-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </>
  );
}
