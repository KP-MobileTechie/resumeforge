import type { Resume } from '@/lib/resume';
import type { ThemeTokens } from '@/lib/themes';
import { fontFamily, spacing } from '../themeStyle';
import { ContactLine, BulletList } from '../sections';

interface Props { resume: Resume; theme: ThemeTokens; }

function SectionHeading({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="mb-2 break-after-avoid">
      <h2
        className="text-[10px] uppercase tracking-widest font-bold"
        style={{ color: accent }}
      >
        {label}
      </h2>
      <div className="mt-0.5 h-[2px] w-8" style={{ backgroundColor: accent }} />
    </div>
  );
}

export function ModernTheme({ resume, theme }: Props) {
  const sp = spacing(theme.density);
  const { profile, experience, education, projects, skills } = resume;

  return (
    <div className={`${sp.pad} ${sp.text}`} style={{ fontFamily: fontFamily(theme.bodyFont) }}>
      {/* Header */}
      <div className="mb-5">
        <h1
          className="text-[26px] font-bold"
          style={{ fontFamily: fontFamily(theme.headingFont), color: theme.accent }}
        >
          {profile.name}
        </h1>
        {profile.title && (
          <p className="text-[13px] text-gray-600 font-medium mt-0.5">{profile.title}</p>
        )}
        <ContactLine profile={profile} />
      </div>

      {/* Summary */}
      {profile.summary && (
        <div className={sp.section}>
          <SectionHeading label="Summary" accent={theme.accent} />
          <p>{profile.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className={sp.section}>
          <SectionHeading label="Experience" accent={theme.accent} />
          {experience.map(e => (
            <div key={e.id} className={`${sp.entry} break-inside-avoid`}>
              <div className="flex justify-between items-baseline">
                <span className="font-semibold">
                  {e.role}
                  {e.company && (
                    <span className="font-normal text-gray-600"> @ {e.company}</span>
                  )}
                </span>
                <span className="text-[11px] text-gray-500">
                  {[e.start, e.end].filter(Boolean).join('–')}
                  {e.location ? ` · ${e.location}` : ''}
                </span>
              </div>
              <BulletList bullets={e.bullets} />
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className={sp.section}>
          <SectionHeading label="Education" accent={theme.accent} />
          {education.map(e => (
            <div key={e.id} className={`${sp.entry} break-inside-avoid`}>
              <div className="flex justify-between items-baseline">
                <span className="font-semibold">
                  {e.degree}{e.school ? `, ${e.school}` : ''}
                </span>
                <span className="text-[11px] text-gray-500">
                  {[e.start, e.end].filter(Boolean).join('–')}
                </span>
              </div>
              {e.details && (
                <p className="text-[11px] text-gray-500 mt-0.5">{e.details}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className={sp.section}>
          <SectionHeading label="Projects" accent={theme.accent} />
          {projects.map(p => (
            <div key={p.id} className={`${sp.entry} break-inside-avoid`}>
              <span className="font-semibold" style={{ color: theme.accent }}>{p.name}</span>
              {p.link && (
                <span className="text-[11px] text-gray-500 ml-1">({p.link})</span>
              )}
              {p.description && <p className="mt-0.5">{p.description}</p>}
              <BulletList bullets={p.bullets} />
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className={sp.section}>
          <SectionHeading label="Skills" accent={theme.accent} />
          {theme.skillsLayout === 'two-col' ? (
            <div className="grid grid-cols-2 gap-x-4">
              {skills.map(s => (
                <div key={s.id} className="break-inside-avoid">
                  <span className="font-semibold">{s.category}:</span>{' '}
                  <span>{s.items.join(', ')}</span>
                </div>
              ))}
            </div>
          ) : (
            skills.map(s => (
              <div key={s.id} className="break-inside-avoid">
                <span className="font-semibold">{s.category}:</span>{' '}
                <span>{s.items.join(', ')}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
