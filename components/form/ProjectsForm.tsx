'use client';

import { type Dispatch } from 'react';
import { type ProjectEntry } from '@/lib/resume';
import { type ResumeAction } from '@/hooks/useResume';
import { Field } from './Field';
import { EntryCard } from './EntryCard';
import { BulletsField } from './BulletsField';

interface ProjectsFormProps {
  items: ProjectEntry[];
  dispatch: Dispatch<ResumeAction>;
}

export function ProjectsForm({ items, dispatch }: ProjectsFormProps) {
  function patch(id: string, p: Partial<ProjectEntry>) {
    dispatch({ type: 'UPDATE_ENTRY', section: 'projects', id, patch: p });
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--fg)]">Projects</h2>
        <button
          type="button"
          onClick={() => dispatch({ type: 'ADD_ENTRY', section: 'projects' })}
          className="rounded border border-[var(--border)] px-2 py-1 text-xs text-[var(--fg-dim)] hover:bg-[var(--bg)] hover:text-[var(--fg)]"
        >
          + Add
        </button>
      </div>
      {items.map((entry) => (
        <EntryCard
          key={entry.id}
          title={entry.name || 'New project'}
          onMoveUp={() => dispatch({ type: 'REORDER', section: 'projects', id: entry.id, dir: 'up' })}
          onMoveDown={() => dispatch({ type: 'REORDER', section: 'projects', id: entry.id, dir: 'down' })}
          onRemove={() => dispatch({ type: 'REMOVE_ENTRY', section: 'projects', id: entry.id })}
        >
          <Field label="Name" value={entry.name} onChange={(v) => patch(entry.id, { name: v })} placeholder="Project name" />
          <Field label="Link" value={entry.link} onChange={(v) => patch(entry.id, { link: v })} placeholder="github.com/you/project" />
          <Field label="Description" value={entry.description} onChange={(v) => patch(entry.id, { description: v })} textarea placeholder="What does it do?" />
          <BulletsField bullets={entry.bullets} onChange={(bullets) => patch(entry.id, { bullets })} />
        </EntryCard>
      ))}
    </section>
  );
}
