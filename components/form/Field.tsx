'use client';

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
  type?: string;
}

export function Field({ label, value, onChange, textarea = false, placeholder, type = 'text' }: FieldProps) {
  const inputClass =
    'w-full rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm text-[var(--fg)] outline-none focus:border-[var(--focus)] focus:ring-1 focus:ring-[var(--focus)]';

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium uppercase tracking-wide text-[var(--fg-dim)]">{label}</label>
      {textarea ? (
        <textarea
          className={`${inputClass} min-h-[72px] resize-y`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className={inputClass}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
