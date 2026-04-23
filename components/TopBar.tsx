'use client';

import { THEME_LIST } from '@/lib/themes';

interface TopBarProps {
  themeId: string;
  onTheme: (id: string) => void;
  onSample: () => void;
  onReset: () => void;
  onDownload?: () => void;
  storageOk: boolean;
}

export function TopBar({ themeId, onTheme, onSample, onReset, onDownload, storageOk }: TopBarProps) {
  const handleDownload = onDownload ?? (() => window.print());

  return (
    <div className="no-print sticky top-0 z-10">
      {/* Main bar */}
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-2">
        {/* Wordmark */}
        <span className="text-sm font-semibold tracking-tight text-[var(--fg)]">
          resumeforge
        </span>

        {/* Right cluster */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Theme switcher */}
          <div className="flex items-center gap-1" role="group" aria-label="Theme">
            {THEME_LIST.map((theme) => {
              const active = theme.id === themeId;
              return (
                <button
                  key={theme.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onTheme(theme.id)}
                  className={[
                    'rounded px-2.5 py-1 text-sm transition-colors',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-2',
                    active
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--fg-dim)] hover:bg-[var(--border)] hover:text-[var(--fg)]',
                  ].join(' ')}
                >
                  {theme.label}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <span className="h-5 w-px bg-[var(--border)]" aria-hidden="true" />

          {/* Load sample */}
          <button
            type="button"
            onClick={onSample}
            className="rounded px-2.5 py-1 text-sm text-[var(--fg-dim)] hover:bg-[var(--border)] hover:text-[var(--fg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-2"
          >
            Load sample
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            className="rounded px-2.5 py-1 text-sm text-[var(--fg-dim)] hover:bg-[var(--border)] hover:text-[var(--fg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-2"
          >
            Reset
          </button>

          {/* Download PDF (primary) */}
          <button
            type="button"
            onClick={handleDownload}
            className="rounded bg-[var(--accent)] px-3 py-1 text-sm font-medium text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-2"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Storage unavailable notice */}
      {!storageOk && (
        <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-1 text-xs text-[var(--fg-dim)]">
          Browser storage is off — your résumé won&apos;t be saved between visits.
        </div>
      )}
    </div>
  );
}
