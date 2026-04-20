'use client';

interface BulletsFieldProps {
  bullets: string[];
  onChange: (next: string[]) => void;
}

export function BulletsField({ bullets, onChange }: BulletsFieldProps) {
  function update(index: number, value: string) {
    const next = [...bullets];
    next[index] = value;
    onChange(next);
  }

  function remove(index: number) {
    onChange(bullets.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...bullets, '']);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--fg-dim)]">Bullets</span>
      {bullets.map((bullet, i) => (
        <div key={i} className="flex items-center gap-1">
          <input
            className="flex-1 rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm text-[var(--fg)] outline-none focus:border-[var(--focus)] focus:ring-1 focus:ring-[var(--focus)]"
            value={bullet}
            onChange={(e) => update(i, e.target.value)}
            placeholder="Bullet point…"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label="Remove bullet"
            className="rounded px-1.5 py-0.5 text-xs text-[var(--fg-dim)] hover:bg-[var(--bg)] hover:text-red-600"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="self-start rounded border border-[var(--border)] px-2 py-1 text-xs text-[var(--fg-dim)] hover:bg-[var(--bg)] hover:text-[var(--fg)]"
      >
        + add bullet
      </button>
    </div>
  );
}
