import { describe, it, expect, beforeEach } from 'vitest';
import { loadResume, saveResume, STORAGE_KEY } from '@/lib/storage';
import { emptyResume, sampleResume } from '@/lib/resume';

beforeEach(() => localStorage.clear());

describe('loadResume', () => {
  it('returns emptyResume when storage empty', () => {
    expect(loadResume()).toEqual(emptyResume());
  });
  it('returns emptyResume on corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{nope');
    expect(loadResume()).toEqual(emptyResume());
  });
  it('returns emptyResume on version mismatch', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 9, resume: sampleResume() }));
    expect(loadResume()).toEqual(emptyResume());
  });
  it('returns emptyResume on incomplete shape', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, resume: { profile: {} } }));
    expect(loadResume()).toEqual(emptyResume());
  });
  it('round-trips a saved resume', () => {
    const r = sampleResume();
    saveResume(r);
    expect(loadResume()).toEqual(r);
  });
});
