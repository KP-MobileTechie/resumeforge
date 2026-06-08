'use client';

import { useEffect, useRef, useState } from 'react';
import { useResume } from '@/hooks/useResume';
import { loadResume, saveResume, isStorageAvailable } from '@/lib/storage';
import { serializeResume, parseResumeJson, resumeFilename } from '@/lib/transfer';
import { FormPanel } from '@/components/form/FormPanel';
import { ResumePreview } from '@/components/preview/ResumePreview';
import { TopBar } from '@/components/TopBar';

export default function Home() {
  const [resume, dispatch] = useResume();
  const hydrated = useRef(false);
  // Initialise storage flag once (lazy initialiser avoids setState-in-effect lint rule)
  const [storageOk] = useState<boolean>(() => isStorageAvailable());

  useEffect(() => {
    if (storageOk) dispatch({ type: 'HYDRATE', resume: loadResume() });
    hydrated.current = true;
  // dispatch is stable (useReducer); storageOk is constant after mount — only run once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced save after hydration
  useEffect(() => {
    if (!hydrated.current) return;
    const t = setTimeout(() => saveResume(resume), 400);
    return () => clearTimeout(t);
  }, [resume]);

  function handleReset() {
    if (window.confirm('Clear the whole résumé and start over?')) {
      dispatch({ type: 'RESET' });
    }
  }

  function handleExport() {
    const blob = new Blob([serializeResume(resume)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resumeFilename(resume);
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(file: File) {
    file
      .text()
      .then((text) => {
        const parsed = parseResumeJson(text);
        if (parsed) dispatch({ type: 'HYDRATE', resume: parsed });
        else window.alert('That file is not a valid resumeforge résumé.');
      })
      .catch(() => window.alert('Could not read that file.'));
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar
        themeId={resume.themeId}
        onTheme={(id) => dispatch({ type: 'SET_THEME', themeId: id })}
        onSample={() => dispatch({ type: 'LOAD_SAMPLE' })}
        onReset={handleReset}
        onDownload={() => window.print()}
        onExport={handleExport}
        onImport={handleImport}
        storageOk={storageOk}
      />
      <div className="flex flex-1 overflow-hidden lg:grid lg:grid-cols-[minmax(360px,460px)_1fr]">
        <section className="no-print h-full overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)]">
          <FormPanel resume={resume} dispatch={dispatch} />
        </section>
        <section className="print-canvas flex justify-center overflow-auto bg-[var(--bg)] p-8">
          <ResumePreview resume={resume} />
        </section>
      </div>
    </div>
  );
}
