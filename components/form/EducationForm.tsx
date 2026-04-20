'use client';

import { type Dispatch } from 'react';
import { type EducationEntry } from '@/lib/resume';
import { type ResumeAction } from '@/hooks/useResume';
import { Field } from './Field';
import { EntryCard } from './EntryCard';

interface EducationFormProps {
  items: EducationEntry[];
  dispatch: Dispatch<ResumeAction>;
}

export function EducationForm({ items, dispatch }: EducationFormProps) {
  function patch(id: string, p: Partial<EducationEntry>) {
    dispatch({ type: 'UPDATE_ENTRY', section: 'education', id, patch: p });
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--fg)]">Education</h2>
        <button
          type="button"
          onClick={() => dispatch({ type: 'ADD_ENTRY', section: 'education' })}
          className="rounded border border-[var(--border)] px-2 py-1 text-xs text-[var(--fg-dim)] hover:bg-[var(--bg)] hover:text-[var(--fg)]"
        >
          + Add
        </button>
      </div>
      {items.map((entry) => (
        <EntryCard
          key={entry.id}
          title={entry.degree || 'New entry'}
          onMoveUp={() => dispatch({ type: 'REORDER', section: 'education', id: entry.id, dir: 'up' })}
          onMoveDown={() => dispatch({ type: 'REORDER', section: 'education', id: entry.id, dir: 'down' })}
          onRemove={() => dispatch({ type: 'REMOVE_ENTRY', section: 'education', id: entry.id })}
        >
          <Field label="Degree" value={entry.degree} onChange={(v) => patch(entry.id, { degree: v })} placeholder="B.Sc. Computer Science" />
          <Field label="School" value={entry.school} onChange={(v) => patch(entry.id, { school: v })} placeholder="University name" />
          <Field label="Start" value={entry.start} onChange={(v) => patch(entry.id, { start: v })} placeholder="2017" />
          <Field label="End" value={entry.end} onChange={(v) => patch(entry.id, { end: v })} placeholder="2021" />
          <Field label="Details" value={entry.details} onChange={(v) => patch(entry.id, { details: v })} textarea placeholder="Focus areas, honours…" />
        </EntryCard>
      ))}
    </section>
  );
}
