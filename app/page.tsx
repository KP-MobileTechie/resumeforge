'use client';

import { useEffect, useRef } from 'react';
import { useResume } from '@/hooks/useResume';
import { loadResume, saveResume, isStorageAvailable } from '@/lib/storage';
import { FormPanel } from '@/components/form/FormPanel';

export default function Home() {
  const [resume, dispatch] = useResume();
  const hydrated = useRef(false);

  useEffect(() => {
    if (isStorageAvailable()) dispatch({ type: 'HYDRATE', resume: loadResume() });
    hydrated.current = true;
  // dispatch is stable (useReducer), only run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced save after hydration
  useEffect(() => {
    if (!hydrated.current) return;
    const t = setTimeout(() => saveResume(resume), 400);
    return () => clearTimeout(t);
  }, [resume]);

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[minmax(360px,460px)_1fr]">
      <section className="no-print h-dvh overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)]">
        <FormPanel resume={resume} dispatch={dispatch} />
      </section>
      <section className="flex justify-center overflow-y-auto bg-[var(--bg)] p-8">
        <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-sm text-[var(--fg-dim)]">
          Preview lands in the next step.
        </div>
      </section>
    </div>
  );
}
