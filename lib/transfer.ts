import { emptyResume, type Resume } from './resume';

/** Shape guard shared with storage: a value is a Resume if all sections are the right kind. */
function isResume(r: unknown): r is Resume {
  if (typeof r !== 'object' || r === null) return false;
  const o = r as Record<string, unknown>;
  return (
    typeof o.profile === 'object' && o.profile !== null &&
    Array.isArray(o.experience) && Array.isArray(o.education) &&
    Array.isArray(o.projects) && Array.isArray(o.skills) &&
    typeof o.themeId === 'string'
  );
}

/** Serialize a résumé to a pretty JSON string for download. */
export function serializeResume(resume: Resume): string {
  return JSON.stringify(resume, null, 2);
}

/**
 * Parse a résumé from imported JSON text. Returns null on invalid JSON or a
 * shape that is not a résumé, so callers can show an error instead of crashing.
 * Unknown fields are merged onto an empty résumé so a partial file still loads.
 */
export function parseResumeJson(text: string): Resume | null {
  try {
    const value = JSON.parse(text) as unknown;
    if (!isResume(value)) return null;
    return { ...emptyResume(), ...value };
  } catch {
    return null;
  }
}

/** Suggested download filename from the profile name (falls back to "resume"). */
export function resumeFilename(resume: Resume): string {
  const base = resume.profile.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${base || 'resume'}.json`;
}
