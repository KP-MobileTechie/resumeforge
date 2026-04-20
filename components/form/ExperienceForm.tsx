'use client';

import { type Dispatch } from 'react';
import { type ExperienceEntry } from '@/lib/resume';
import { type ResumeAction } from '@/hooks/useResume';
import { Field } from './Field';
import { EntryCard } from './EntryCard';
import { BulletsField } from './BulletsField';

interface ExperienceFormProps {
  items: ExperienceEntry[];
  dispatch: Dispatch<ResumeAction>;
}

export function ExperienceForm({ items, dispatch }: ExperienceFormProps) {
  function patch(id: string, p: Partial<ExperienceEntry>) {
    dispatch({ type: 'UPDATE_ENTRY', section: 'experience', id, patch: p });
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--fg)]">Experience</h2>
        <button
          type="button"
          onClick={() => dispatch({ type: 'ADD_ENTRY', section: 'experience' })}
          className="rounded border border-[var(--border)] px-2 py-1 text-xs text-[var(--fg-dim)] hover:bg-[var(--bg)] hover:text-[var(--fg)]"
        >
          + Add
        </button>
      </div>
      {items.map((entry) => (
        <EntryCard
          key={entry.id}
          title={entry.role || 'New role'}
          onMoveUp={() => dispatch({ type: 'REORDER', section: 'experience', id: entry.id, dir: 'up' })}
          onMoveDown={() => dispatch({ type: 'REORDER', section: 'experience', id: entry.id, dir: 'down' })}
          onRemove={() => dispatch({ type: 'REMOVE_ENTRY', section: 'experience', id: entry.id })}
        >
          <Field label="Role" value={entry.role} onChange={(v) => patch(entry.id, { role: v })} placeholder="Job title" />
          <Field label="Company" value={entry.company} onChange={(v) => patch(entry.id, { company: v })} placeholder="Company name" />
          <Field label="Start" value={entry.start} onChange={(v) => patch(entry.id, { start: v })} placeholder="2021" />
          <Field label="End" value={entry.end} onChange={(v) => patch(entry.id, { end: v })} placeholder="Present" />
          <Field label="Location" value={entry.location} onChange={(v) => patch(entry.id, { location: v })} placeholder="City or Remote" />
          <BulletsField bullets={entry.bullets} onChange={(bullets) => patch(entry.id, { bullets })} />
        </EntryCard>
      ))}
    </section>
  );
}
