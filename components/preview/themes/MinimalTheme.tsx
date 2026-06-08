import type { Resume } from '@/lib/resume';
import type { ThemeTokens } from '@/lib/themes';
import { fontFamily, spacing } from '../themeStyle';
import { ContactLine, BulletList } from '../sections';

interface Props { resume: Resume; theme: ThemeTokens; }

/** Monochrome, whitespace-led layout: no color accents, hairline rules only. */
function SectionHeading({ label }: { label: string }) {
  return (
    <h2 className="mb-2 break-after-avoid border-t border-gray-200 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
      {label}
    </h2>
  );
}

export function MinimalTheme({ resume, theme }: Props) {
  const sp = spacing(theme.density);
  const { profile, experience, education, projects, skills } = resume;

  return (
    <div className={`${sp.pad} ${sp.text}`} style={{ fontFamily: fontFamily(theme.bodyFont) }}>
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-[24px] font-light uppercase tracking-[0.18em] text-gray-900"
          style={{ fontFamily: fontFamily(theme.headingFont) }}
        >
          {profile.name}
        </h1>
        {profile.title && (
          <p className="mt-1 text-[12px] uppercase tracking-[0.12em] text-gray-500">{profile.title}</p>
        )}
        <ContactLine profile={profile} />
      </div>

      {profile.summary && (
        <div className={sp.section}>
          <SectionHeading label="Summary" />
          <p>{profile.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className={sp.section}>
          <SectionHeading label="Experience" />
          {experience.map(e => (
            <div key={e.id} className={`${sp.entry} break-inside-avoid`}>
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-gray-900">
                  {e.role}
                  {e.company && <span className="font-normal text-gray-600"> · {e.company}</span>}
                </span>
                <span className="text-[11px] text-gray-400">
                  {[e.start, e.end].filter(Boolean).join('–')}
                  {e.location ? ` · ${e.location}` : ''}
                </span>
              </div>
              <BulletList bullets={e.bullets} />
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className={sp.section}>
          <SectionHeading label="Education" />
          {education.map(e => (
            <div key={e.id} className={`${sp.entry} break-inside-avoid`}>
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-gray-900">
                  {e.degree}{e.school ? `, ${e.school}` : ''}
                </span>
                <span className="text-[11px] text-gray-400">
                  {[e.start, e.end].filter(Boolean).join('–')}
                </span>
              </div>
              {e.details && <p className="mt-0.5 text-[11px] text-gray-500">{e.details}</p>}
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className={sp.section}>
          <SectionHeading label="Projects" />
          {projects.map(p => (
            <div key={p.id} className={`${sp.entry} break-inside-avoid`}>
              <span className="font-medium text-gray-900">{p.name}</span>
              {p.link && <span className="ml-1 text-[11px] text-gray-400">({p.link})</span>}
              {p.description && <p className="mt-0.5">{p.description}</p>}
              <BulletList bullets={p.bullets} />
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className={sp.section}>
          <SectionHeading label="Skills" />
          {skills.map(s => (
            <div key={s.id} className="break-inside-avoid">
              <span className="font-medium text-gray-900">{s.category}:</span>{' '}
              <span className="text-gray-700">{s.items.join(', ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
