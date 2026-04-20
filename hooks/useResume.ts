'use client';

import { useReducer } from 'react';
import {
  emptyResume, sampleResume, emptyExperience, emptyEducation, emptyProject, emptySkillGroup,
  type Resume, type Profile,
} from '@/lib/resume';

export type ListSection = 'experience' | 'education' | 'projects' | 'skills';

export type ResumeAction =
  | { type: 'SET_PROFILE_FIELD'; field: keyof Profile; value: string }
  | { type: 'ADD_ENTRY'; section: ListSection }
  | { type: 'REMOVE_ENTRY'; section: ListSection; id: string }
  | { type: 'UPDATE_ENTRY'; section: ListSection; id: string; patch: Record<string, unknown> }
  | { type: 'REORDER'; section: ListSection; id: string; dir: 'up' | 'down' }
  | { type: 'SET_THEME'; themeId: string }
  | { type: 'LOAD_SAMPLE' }
  | { type: 'RESET' }
  | { type: 'HYDRATE'; resume: Resume };

function makeEntry(section: ListSection) {
  switch (section) {
    case 'experience': return emptyExperience();
    case 'education': return emptyEducation();
    case 'projects': return emptyProject();
    case 'skills': return emptySkillGroup();
  }
}

function reorder<T>(arr: T[], index: number, dir: 'up' | 'down'): T[] {
  const target = dir === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= arr.length) return arr; // boundary no-op
  const next = [...arr];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function reducer(state: Resume, action: ResumeAction): Resume {
  switch (action.type) {
    case 'SET_PROFILE_FIELD':
      return { ...state, profile: { ...state.profile, [action.field]: action.value } };
    case 'ADD_ENTRY':
      return { ...state, [action.section]: [...state[action.section], makeEntry(action.section)] } as Resume;
    case 'REMOVE_ENTRY':
      return { ...state, [action.section]: (state[action.section] as { id: string }[]).filter((e) => e.id !== action.id) } as Resume;
    case 'UPDATE_ENTRY':
      return { ...state, [action.section]: (state[action.section] as { id: string }[]).map((e) => e.id === action.id ? { ...e, ...action.patch } : e) } as Resume;
    case 'REORDER': {
      const list = state[action.section] as { id: string }[];
      const idx = list.findIndex((e) => e.id === action.id);
      if (idx === -1) return state;
      const next = reorder(list, idx, action.dir);
      if (next === list) return state;
      return { ...state, [action.section]: next } as Resume;
    }
    case 'SET_THEME':
      return { ...state, themeId: action.themeId };
    case 'LOAD_SAMPLE':
      return sampleResume();
    case 'RESET':
      return emptyResume();
    case 'HYDRATE':
      return action.resume;
  }
}

export function useResume() {
  return useReducer(reducer, undefined, emptyResume);
}
