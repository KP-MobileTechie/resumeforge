import { describe, it, expect } from 'vitest';
import { THEMES, THEME_LIST, getTheme } from '@/lib/themes';

describe('themes', () => {
  it('has three themes', () => {
    expect(THEME_LIST).toHaveLength(3);
  });
  it('each theme has a complete token set and id matches key', () => {
    for (const [key, t] of Object.entries(THEMES)) {
      expect(t.id).toBe(key);
      expect(t.label.length).toBeGreaterThan(0);
      expect(['sans', 'serif']).toContain(t.headingFont);
      expect(['sans', 'serif']).toContain(t.bodyFont);
      expect(t.accent).toMatch(/^#[0-9a-f]{6}$/i);
      expect(['normal', 'compact']).toContain(t.density);
      expect(['list', 'two-col']).toContain(t.skillsLayout);
    }
  });
  it('getTheme falls back to modern on unknown id', () => {
    expect(getTheme('nope').id).toBe('modern');
    expect(getTheme('classic').id).toBe('classic');
  });
});
