import { describe, it, expect } from 'vitest';
import { emptyResume, sampleResume, DEFAULT_THEME_ID } from '@/lib/resume';

describe('emptyResume', () => {
  it('has empty sections and the default theme', () => {
    const r = emptyResume();
    expect(r.experience).toEqual([]);
    expect(r.education).toEqual([]);
    expect(r.projects).toEqual([]);
    expect(r.skills).toEqual([]);
    expect(r.themeId).toBe(DEFAULT_THEME_ID);
    expect(r.profile.name).toBe('');
  });
});

describe('sampleResume', () => {
  it('fills every section with valid entries', () => {
    const r = sampleResume();
    expect(r.profile.name.length).toBeGreaterThan(0);
    expect(r.experience.length).toBeGreaterThan(0);
    expect(r.education.length).toBeGreaterThan(0);
    expect(r.projects.length).toBeGreaterThan(0);
    expect(r.skills.length).toBeGreaterThan(0);
  });

  it('gives every entry a unique non-empty id', () => {
    const r = sampleResume();
    const ids = [
      ...r.experience.map((e) => e.id),
      ...r.education.map((e) => e.id),
      ...r.projects.map((e) => e.id),
      ...r.skills.map((e) => e.id),
    ];
    expect(ids.every((id) => typeof id === 'string' && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
