import type { Resume } from '@/lib/resume';
import { getTheme } from '@/lib/themes';
import { fontFamily, spacing } from './themeStyle';
import { ClassicTheme } from './themes/ClassicTheme';
import { ModernTheme } from './themes/ModernTheme';
import { CompactTheme } from './themes/CompactTheme';
import { MinimalTheme } from './themes/MinimalTheme';

interface Props {
  resume: Resume;
}

function isEmpty(resume: Resume): boolean {
  return (
    !resume.profile.name &&
    !resume.profile.title &&
    !resume.profile.email &&
    !resume.profile.phone &&
    !resume.profile.location &&
    !resume.profile.website &&
    !resume.profile.summary &&
    resume.experience.length === 0 &&
    resume.education.length === 0 &&
    resume.projects.length === 0 &&
    resume.skills.length === 0
  );
}

export function ResumePreview({ resume }: Props) {
  const theme = getTheme(resume.themeId);
  const sp = spacing(theme.density);
  const empty = isEmpty(resume);

  return (
    /* Scale wrapper — shrinks the 210mm page to fit narrower viewports on screen.
       The print CSS resets transform to none so the page prints true-size. */
    <div className="preview-scale" style={{ transform: 'scale(var(--preview-scale, 0.85))', transformOrigin: 'top center' }}>
      <div
        className={`resume-page ${sp.text}`}
        style={{ fontFamily: fontFamily(theme.bodyFont) }}
      >
        {empty ? (
          /* Empty state placeholder */
          <div className={`${sp.pad} flex flex-col items-center justify-start pt-16 text-gray-300`}>
            <p className="text-[28px] font-bold mb-2" style={{ fontFamily: fontFamily(theme.headingFont) }}>
              Your name
            </p>
            <p className="text-[13px] text-center max-w-[260px]">
              Start filling the form to see your résumé here.
            </p>
          </div>
        ) : theme.id === 'classic' ? (
          <ClassicTheme resume={resume} theme={theme} />
        ) : theme.id === 'compact' ? (
          <CompactTheme resume={resume} theme={theme} />
        ) : theme.id === 'minimal' ? (
          <MinimalTheme resume={resume} theme={theme} />
        ) : (
          <ModernTheme resume={resume} theme={theme} />
        )}
      </div>
    </div>
  );
}
