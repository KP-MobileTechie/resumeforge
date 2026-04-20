'use client';

import { type Dispatch } from 'react';
import { type Profile } from '@/lib/resume';
import { type ResumeAction } from '@/hooks/useResume';
import { Field } from './Field';

interface ProfileFormProps {
  profile: Profile;
  dispatch: Dispatch<ResumeAction>;
}

export function ProfileForm({ profile, dispatch }: ProfileFormProps) {
  function set(field: keyof Profile) {
    return (value: string) => dispatch({ type: 'SET_PROFILE_FIELD', field, value });
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-[var(--fg)]">Profile</h2>
      <Field label="Name" value={profile.name} onChange={set('name')} placeholder="Full name" />
      <Field label="Title" value={profile.title} onChange={set('title')} placeholder="Job title" />
      <Field label="Email" value={profile.email} onChange={set('email')} placeholder="you@example.com" type="email" />
      <Field label="Phone" value={profile.phone} onChange={set('phone')} placeholder="+1 555 0100" type="tel" />
      <Field label="Location" value={profile.location} onChange={set('location')} placeholder="City, Country" />
      <Field label="Website" value={profile.website} onChange={set('website')} placeholder="yoursite.dev" />
      <Field label="Summary" value={profile.summary} onChange={set('summary')} textarea placeholder="Short professional summary…" />
    </section>
  );
}
