'use client';

import { type Dispatch } from 'react';
import { type Resume } from '@/lib/resume';
import { type ResumeAction } from '@/hooks/useResume';
import { ProfileForm } from './ProfileForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { ProjectsForm } from './ProjectsForm';
import { SkillsForm } from './SkillsForm';

interface FormPanelProps {
  resume: Resume;
  dispatch: Dispatch<ResumeAction>;
}

export function FormPanel({ resume, dispatch }: FormPanelProps) {
  return (
    <div className="overflow-y-auto p-4 space-y-8">
      <ProfileForm profile={resume.profile} dispatch={dispatch} />
      <ExperienceForm items={resume.experience} dispatch={dispatch} />
      <EducationForm items={resume.education} dispatch={dispatch} />
      <ProjectsForm items={resume.projects} dispatch={dispatch} />
      <SkillsForm items={resume.skills} dispatch={dispatch} />
    </div>
  );
}
