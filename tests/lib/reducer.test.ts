import { describe, it, expect } from 'vitest';
import { reducer } from '@/hooks/useResume';
import { emptyResume, sampleResume } from '@/lib/resume';

describe('resume reducer', () => {
  it('sets a profile field', () => {
    const s = reducer(emptyResume(), { type: 'SET_PROFILE_FIELD', field: 'name', value: 'Avery' });
    expect(s.profile.name).toBe('Avery');
  });
  it('adds an entry with an id', () => {
    const s = reducer(emptyResume(), { type: 'ADD_ENTRY', section: 'experience' });
    expect(s.experience).toHaveLength(1);
    expect(s.experience[0].id.length).toBeGreaterThan(0);
  });
  it('removes an entry by id', () => {
    let s = reducer(emptyResume(), { type: 'ADD_ENTRY', section: 'education' });
    const id = s.education[0].id;
    s = reducer(s, { type: 'REMOVE_ENTRY', section: 'education', id });
    expect(s.education).toHaveLength(0);
  });
  it('updates an entry via patch', () => {
    let s = reducer(emptyResume(), { type: 'ADD_ENTRY', section: 'projects' });
    const id = s.projects[0].id;
    s = reducer(s, { type: 'UPDATE_ENTRY', section: 'projects', id, patch: { name: 'snapfolio' } });
    expect(s.projects[0].name).toBe('snapfolio');
  });
  it('reorders entries up and down', () => {
    let s = reducer(emptyResume(), { type: 'ADD_ENTRY', section: 'experience' });
    s = reducer(s, { type: 'ADD_ENTRY', section: 'experience' });
    const [a, b] = s.experience.map((e) => e.id);
    s = reducer(s, { type: 'REORDER', section: 'experience', id: b, dir: 'up' });
    expect(s.experience.map((e) => e.id)).toEqual([b, a]);
    s = reducer(s, { type: 'REORDER', section: 'experience', id: b, dir: 'down' });
    expect(s.experience.map((e) => e.id)).toEqual([a, b]);
  });
  it('reorder at boundaries is a no-op', () => {
    let s = reducer(emptyResume(), { type: 'ADD_ENTRY', section: 'experience' });
    s = reducer(s, { type: 'ADD_ENTRY', section: 'experience' });
    const ids = s.experience.map((e) => e.id);
    const up = reducer(s, { type: 'REORDER', section: 'experience', id: ids[0], dir: 'up' });
    expect(up.experience.map((e) => e.id)).toEqual(ids);
    const down = reducer(s, { type: 'REORDER', section: 'experience', id: ids[1], dir: 'down' });
    expect(down.experience.map((e) => e.id)).toEqual(ids);
  });
  it('sets theme, loads sample, resets, hydrates', () => {
    expect(reducer(emptyResume(), { type: 'SET_THEME', themeId: 'classic' }).themeId).toBe('classic');
    expect(reducer(emptyResume(), { type: 'LOAD_SAMPLE' }).experience.length).toBeGreaterThan(0);
    const sample = sampleResume();
    expect(reducer(sample, { type: 'RESET' }).experience).toHaveLength(0);
    expect(reducer(emptyResume(), { type: 'HYDRATE', resume: sample })).toEqual(sample);
  });
});
