import { Injectable, signal } from '@angular/core';

export type PrimaryDisability =
  | 'low_vision'
  | 'blind'
  | 'deaf'
  | 'hard_of_hearing'
  | 'motor'
  | 'cognitive'
  | 'none';

export type ReadingLevel = 'standard' | 'simplified';
export type OutputModality = 'audio' | 'text' | 'haptic';

export interface AccessibilityPreferences {
  primary_disability: PrimaryDisability;
  reading_level: ReadingLevel;
  output_modalities: OutputModality[];
}

const STORAGE_KEY = 'accessos_preferences';

export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  primary_disability: 'none',
  reading_level: 'standard',
  output_modalities: ['text'],
};

/**
 * Accessibility preferences (Section 07). Matches
 * backend/src/lib/models/User.ts's AccessibilityPreferences shape exactly
 * so the same object can be sent straight through as
 * `user_context.preferences` on every /v1/accessibility/assist call.
 *
 * Persisted to localStorage only — there is no
 * `PATCH /v1/users/me/preferences` backend route yet, so this does not
 * sync server-side. That matches the Features page's LIVE description:
 * "persisted locally and sent with every Companion request, actually
 * changing backend behavior" — the behavior change is real even though
 * the storage is local-only.
 */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly _preferences = signal<AccessibilityPreferences>(this.readStored());
  readonly preferences = this._preferences.asReadonly();

  private readStored(): AccessibilityPreferences {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_PREFERENCES };
      const parsed = JSON.parse(raw);
      return {
        primary_disability: parsed.primary_disability || DEFAULT_PREFERENCES.primary_disability,
        reading_level: parsed.reading_level || DEFAULT_PREFERENCES.reading_level,
        output_modalities:
          Array.isArray(parsed.output_modalities) && parsed.output_modalities.length
            ? parsed.output_modalities
            : DEFAULT_PREFERENCES.output_modalities,
      };
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  }

  get(): AccessibilityPreferences {
    return this._preferences();
  }

  save(prefs: AccessibilityPreferences): void {
    this._preferences.set(prefs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }

  reset(): void {
    this.save({ ...DEFAULT_PREFERENCES });
  }
}
