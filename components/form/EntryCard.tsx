'use client';

import { type ReactNode } from 'react';

interface EntryCardProps {
  title: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  children: ReactNode;
}

export function EntryCard({ title, onMoveUp, onMoveDown, onRemove, children }: EntryCardProps) {
  return (
    <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium text-[var(--fg)]">{title}</span>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onMoveUp}
            aria-label="Move up"
            className="rounded px-1.5 py-0.5 text-xs text-[var(--fg-dim)] hover:bg-[var(--bg)] hover:text-[var(--fg)]"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            aria-label="Move down"
            className="rounded px-1.5 py-0.5 text-xs text-[var(--fg-dim)] hover:bg-[var(--bg)] hover:text-[var(--fg)]"
          >
            ▼
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove entry"
            className="rounded px-1.5 py-0.5 text-xs text-[var(--fg-dim)] hover:bg-[var(--bg)] hover:text-red-600"
          >
            ✕
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
