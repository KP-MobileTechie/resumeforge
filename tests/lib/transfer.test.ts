import { describe, it, expect } from 'vitest';
import { serializeResume, parseResumeJson, resumeFilename } from '@/lib/transfer';
import { emptyResume, sampleResume } from '@/lib/resume';

describe('serializeResume / parseResumeJson', () => {
  it('round-trips a sample résumé', () => {
    const r = sampleResume();
    expect(parseResumeJson(serializeResume(r))).toEqual(r);
  });

  it('returns null for invalid JSON', () => {
    expect(parseResumeJson('{not json')).toBeNull();
  });

  it('returns null for JSON that is not a résumé', () => {
    expect(parseResumeJson(JSON.stringify({ hello: 'world' }))).toBeNull();
  });

  it('merges a partial-but-valid résumé onto defaults', () => {
    const partial = { ...emptyResume(), profile: { ...emptyResume().profile, name: 'Avery' } };
    const parsed = parseResumeJson(JSON.stringify(partial))!;
    expect(parsed.profile.name).toBe('Avery');
    expect(parsed.experience).toEqual([]);
  });
});

describe('resumeFilename', () => {
  it('slugifies the profile name', () => {
    const r = { ...emptyResume(), profile: { ...emptyResume().profile, name: 'Avery Sharma' } };
    expect(resumeFilename(r)).toBe('avery-sharma.json');
  });

  it('falls back to resume.json when no name', () => {
    expect(resumeFilename(emptyResume())).toBe('resume.json');
  });
});
