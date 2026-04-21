import type { ThemeTokens } from '@/lib/themes';

export function fontFamily(which: 'sans' | 'serif'): string {
  return which === 'serif'
    ? 'var(--font-serif), Georgia, serif'
    : 'var(--font-sans), system-ui, sans-serif';
}

export function spacing(density: ThemeTokens['density']) {
  return density === 'compact'
    ? { section: 'mb-3', entry: 'mb-2', pad: 'p-10', text: 'text-[12px] leading-snug' }
    : { section: 'mb-5', entry: 'mb-4', pad: 'p-14', text: 'text-[13px] leading-normal' };
}
