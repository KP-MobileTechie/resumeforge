'use client';

import { type Dispatch } from 'react';
import { type SkillGroup } from '@/lib/resume';
import { type ResumeAction } from '@/hooks/useResume';
import { Field } from './Field';
import { EntryCard } from './EntryCard';

interface SkillsFormProps {
  items: SkillGroup[];
  dispatch: Dispatch<ResumeAction>;
}

export function SkillsForm({ items, dispatch }: SkillsFormProps) {
  function patch(id: string, p: Partial<SkillGroup>) {
    dispatch({ type: 'UPDATE_ENTRY', section: 'skills', id, patch: p });
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--fg)]">Skills</h2>
        <button
          type="button"
          onClick={() => dispatch({ type: 'ADD_ENTRY', section: 'skills' })}
          className="rounded border border-[var(--border)] px-2 py-1 text-xs text-[var(--fg-dim)] hover:bg-[var(--bg)] hover:text-[var(--fg)]"
        >
          + Add
        </button>
      </div>
      {items.map((entry) => (
        <EntryCard
          key={entry.id}
          title={entry.category || 'New group'}
          onMoveUp={() => dispatch({ type: 'REORDER', section: 'skills', id: entry.id, dir: 'up' })}
          onMoveDown={() => dispatch({ type: 'REORDER', section: 'skills', id: entry.id, dir: 'down' })}
          onRemove={() => dispatch({ type: 'REMOVE_ENTRY', section: 'skills', id: entry.id })}
        >
          <Field
            label="Category"
            value={entry.category}
            onChange={(v) => patch(entry.id, { category: v })}
            placeholder="Languages, Frameworks…"
          />
          <Field
            label="Items (comma-separated)"
            value={entry.items.join(', ')}
            onChange={(v) => {
              const items = v.split(',').map((s) => s.trim()).filter(Boolean);
              patch(entry.id, { items });
            }}
            placeholder="TypeScript, React, Node.js"
          />
        </EntryCard>
      ))}
    </section>
  );
}
