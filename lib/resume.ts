export interface ExperienceEntry {
  id: string; role: string; company: string; start: string; end: string; location: string; bullets: string[];
}
export interface EducationEntry {
  id: string; degree: string; school: string; start: string; end: string; details: string;
}
export interface ProjectEntry {
  id: string; name: string; link: string; description: string; bullets: string[];
}
export interface SkillGroup { id: string; category: string; items: string[]; }
export interface Profile {
  name: string; title: string; email: string; phone: string; location: string; website: string; summary: string;
}
export interface Resume {
  profile: Profile;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  skills: SkillGroup[];
  themeId: string;
}

export const DEFAULT_THEME_ID = 'modern';

export function emptyProfile(): Profile {
  return { name: '', title: '', email: '', phone: '', location: '', website: '', summary: '' };
}
export function emptyResume(): Resume {
  return { profile: emptyProfile(), experience: [], education: [], projects: [], skills: [], themeId: DEFAULT_THEME_ID };
}

let _idc = 0;
/** Deterministic-per-process id (no Math.random/Date.now so tests are stable). */
export function newId(prefix = 'e'): string { _idc += 1; return `${prefix}_${_idc}`; }

export function emptyExperience(): ExperienceEntry {
  return { id: newId('exp'), role: '', company: '', start: '', end: '', location: '', bullets: [''] };
}
export function emptyEducation(): EducationEntry {
  return { id: newId('edu'), degree: '', school: '', start: '', end: '', details: '' };
}
export function emptyProject(): ProjectEntry {
  return { id: newId('prj'), name: '', link: '', description: '', bullets: [''] };
}
export function emptySkillGroup(): SkillGroup {
  return { id: newId('skl'), category: '', items: [] };
}

export function sampleResume(): Resume {
  return {
    profile: {
      name: 'Avery Sharma',
      title: 'Frontend Engineer',
      email: 'avery.sharma@example.com',
      phone: '+1 555 0117',
      location: 'Berlin, DE',
      website: 'averysharma.dev',
      summary:
        'Frontend engineer with 4 years building accessible, performant React applications. I care about clean component boundaries, fast load times, and interfaces that feel obvious to use.',
    },
    experience: [
      { id: newId('exp'), role: 'Senior Frontend Engineer', company: 'Northwind Labs', start: '2023', end: 'Present', location: 'Berlin',
        bullets: [
          'Led the migration of a 200-component app to the Next.js App Router, cutting time-to-interactive by 38%.',
          'Built a typed design-system package adopted by 4 product teams.',
          'Mentored two junior engineers through their first production launches.',
        ] },
      { id: newId('exp'), role: 'Frontend Engineer', company: 'Citrus', start: '2021', end: '2023', location: 'Remote',
        bullets: [
          'Shipped the checkout redesign that lifted conversion 11%.',
          'Introduced visual regression testing, eliminating a recurring class of CSS bugs.',
        ] },
    ],
    education: [
      { id: newId('edu'), degree: 'B.Sc. Computer Science', school: 'TU Munich', start: '2017', end: '2021', details: 'Focus on human-computer interaction.' },
    ],
    projects: [
      { id: newId('prj'), name: 'snapfolio', link: 'github.com/example/snapfolio', description: 'Travel photo gallery with EXIF mapping and CDN uploads.', bullets: ['Blur-up image loading', 'Client-side EXIF GPS parsing'] },
      { id: newId('prj'), name: 'dropfour', link: 'github.com/example/dropfour', description: 'Connect Four with a minimax AI.', bullets: ['Alpha-beta pruning', 'Three difficulty levels'] },
    ],
    skills: [
      { id: newId('skl'), category: 'Languages', items: ['TypeScript', 'JavaScript', 'HTML', 'CSS'] },
      { id: newId('skl'), category: 'Frameworks', items: ['React', 'Next.js', 'Tailwind CSS'] },
      { id: newId('skl'), category: 'Tooling', items: ['Vitest', 'Playwright', 'Git', 'Vercel'] },
    ],
    themeId: DEFAULT_THEME_ID,
  };
}
