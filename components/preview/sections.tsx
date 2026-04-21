import type { Profile } from '@/lib/resume';

export function ContactLine({ profile }: { profile: Profile }) {
  const parts = [profile.email, profile.phone, profile.location, profile.website].filter(Boolean);
  if (!parts.length) return null;
  return (
    <p className="text-[11px] text-gray-500 mt-0.5">
      {parts.join(' · ')}
    </p>
  );
}

export function BulletList({ bullets }: { bullets: string[] }) {
  const items = bullets.filter(Boolean);
  if (!items.length) return null;
  return (
    <ul className="list-disc pl-4 mt-1 space-y-0.5">
      {items.map((b, i) => <li key={i}>{b}</li>)}
    </ul>
  );
}
