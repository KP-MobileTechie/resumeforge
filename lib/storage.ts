import { emptyResume, type Resume } from './resume';

export const STORAGE_KEY = 'resumeforge:v1';
interface Stored { version: 1; resume: Resume; }

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

export function isStorageAvailable(): boolean {
  try { const k = '__rf__'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return true; } catch { return false; }
}

export function loadResume(): Resume {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyResume();
    const p = JSON.parse(raw) as Stored;
    if (p?.version !== 1 || !isResume(p.resume)) return emptyResume();
    return p.resume;
  } catch { return emptyResume(); }
}

export function saveResume(resume: Resume): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, resume })); } catch {}
}
