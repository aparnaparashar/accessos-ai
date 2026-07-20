import { SettingsService, DEFAULT_PREFERENCES, AccessibilityPreferences } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    localStorage.clear();
    service = new SettingsService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns defaults when localStorage is empty', () => {
    expect(service.get()).toEqual(DEFAULT_PREFERENCES);
  });

  it('returns defaults when localStorage has invalid JSON', () => {
    localStorage.setItem('accessos_preferences', '{invalid');
    const fresh = new SettingsService();
    expect(fresh.get()).toEqual(DEFAULT_PREFERENCES);
  });

  it('returns defaults for missing fields in stored JSON', () => {
    localStorage.setItem('accessos_preferences', '{}');
    const fresh = new SettingsService();
    const prefs = fresh.get();
    expect(prefs.primary_disability).toBe('none');
    expect(prefs.reading_level).toBe('standard');
    expect(prefs.output_modalities).toEqual(['text']);
  });

  describe('save()', () => {
    it('writes to localStorage and updates signal', () => {
      const custom: AccessibilityPreferences = {
        primary_disability: 'blind',
        reading_level: 'simplified',
        output_modalities: ['audio', 'text'],
      };

      service.save(custom);

      expect(service.get()).toEqual(custom);
      expect(JSON.parse(localStorage.getItem('accessos_preferences')!)).toEqual(custom);
    });

    it('persists across service re-instantiation', () => {
      service.save({
        primary_disability: 'low_vision',
        reading_level: 'simplified',
        output_modalities: ['haptic'],
      });

      const fresh = new SettingsService();
      expect(fresh.get().primary_disability).toBe('low_vision');
      expect(fresh.get().output_modalities).toEqual(['haptic']);
    });
  });

  describe('reset()', () => {
    it('restores defaults', () => {
      service.save({
        primary_disability: 'deaf',
        reading_level: 'simplified',
        output_modalities: ['audio', 'haptic'],
      });

      service.reset();

      expect(service.get()).toEqual(DEFAULT_PREFERENCES);
    });
  });

  describe('preferences signal', () => {
    it('is reactive', () => {
      const values: AccessibilityPreferences[] = [];
      // Read from the readonly signal
      values.push(service.preferences());

      service.save({ ...DEFAULT_PREFERENCES, primary_disability: 'motor' });
      values.push(service.preferences());

      expect(values[0].primary_disability).toBe('none');
      expect(values[1].primary_disability).toBe('motor');
    });
  });
});
