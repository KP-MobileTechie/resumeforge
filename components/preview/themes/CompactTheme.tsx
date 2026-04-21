import type { Resume } from '@/lib/resume';
import type { ThemeTokens } from '@/lib/themes';
import { fontFamily, spacing } from '../themeStyle';
import { ContactLine, BulletList } from '../sections';

interface Props { resume: Resume; theme: ThemeTokens; }

function SectionHeading({ label, accent }: { label: string; accent: string }) {
  return (
    <h2
      className="text-[9px] uppercase tracking-wider font-bold mb-1 break-after-avoid"
      style={{ color: accent }}
    >
      {label}
    </h2>
  );
}

export function CompactTheme({ resume, theme }: Props) {
  const sp = spacing(theme.density);
  const { profile, experience, education, projects, skills } = resume;

  return (
    <div className={`${sp.pad} ${sp.text}`} style={{ fontFamily: fontFamily(theme.bodyFont) }}>
      {/* Header */}
      <div className="mb-3 flex items-baseline justify-between border-b pb-2" style={{ borderColor: theme.accent }}>
        <div>
          <h1
            className="text-[20px] font-bold"
            style={{ fontFamily: fontFamily(theme.headingFont), color: theme.accent }}
          >
            {profile.name}
          </h1>
          {profile.title && (
            <p className="text-[11px] text-gray-600 mt-0.5">{profile.title}</p>
          )}
        </div>
        <div className="text-right">
          <ContactLine profile={profile} />
        </div>
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
                  {e.role}{e.company ? ` · ${e.company}` : ''}
                </span>
                <span className="text-[10px] text-gray-500">
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
                <span className="text-[10px] text-gray-500">
                  {[e.start, e.end].filter(Boolean).join('–')}
                </span>
              </div>
              {e.details && (
                <p className="text-[10px] text-gray-500 mt-0.5">{e.details}</p>
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
                <span className="text-[10px] text-gray-500 ml-1">({p.link})</span>
              )}
              {p.description && <p className="mt-0.5">{p.description}</p>}
              <BulletList bullets={p.bullets} />
            </div>
          ))}
        </div>
      )}

      {/* Skills — two-col by default for compact */}
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
