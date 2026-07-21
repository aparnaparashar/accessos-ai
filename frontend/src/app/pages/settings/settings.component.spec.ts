import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SettingsComponent } from './settings.component';
import { SettingsService, DEFAULT_PREFERENCES } from '../../core/settings.service';
import { ToastService } from '../../core/toast.service';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let settingsService: SettingsService;
  let toastService: ToastService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    settingsService = TestBed.inject(SettingsService);
    toastService = TestBed.inject(ToastService);
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes form with current preferences', () => {
    expect(component.form.primary_disability).toBe(DEFAULT_PREFERENCES.primary_disability);
    expect(component.form.reading_level).toBe(DEFAULT_PREFERENCES.reading_level);
    expect(component.form.output_modalities).toEqual(DEFAULT_PREFERENCES.output_modalities);
  });

  it('renders the disability select with all options', () => {
    const el: HTMLElement = fixture.nativeElement;
    const options = el.querySelectorAll('#disability option');
    expect(options.length).toBe(7); // none, low_vision, blind, deaf, hard_of_hearing, motor, cognitive
  });

  it('renders reading level select', () => {
    const el: HTMLElement = fixture.nativeElement;
    const options = el.querySelectorAll('#reading-level option');
    expect(options.length).toBe(2); // standard, simplified
  });

  describe('save()', () => {
    it('persists preferences via SettingsService and shows success toast', () => {
      spyOn(settingsService, 'save').and.callThrough();
      spyOn(toastService, 'success');

      component.form = {
        primary_disability: 'blind',
        reading_level: 'simplified',
        output_modalities: ['audio', 'text'],
      };

      component.save();

      expect(settingsService.save).toHaveBeenCalledWith({
        primary_disability: 'blind',
        reading_level: 'simplified',
        output_modalities: ['audio', 'text'],
      });
      expect(toastService.success).toHaveBeenCalledWith('Preferences saved.');
    });

    it('shows error toast when no modalities selected', () => {
      spyOn(toastService, 'error');

      component.form.output_modalities = [];
      component.save();

      expect(toastService.error).toHaveBeenCalledWith('Choose at least one output modality.');
    });
  });

  describe('toggleModality()', () => {
    it('adds modality when not present', () => {
      component.form.output_modalities = ['text'];
      component.toggleModality('audio');
      expect(component.form.output_modalities).toContain('audio');
      expect(component.form.output_modalities).toContain('text');
    });

    it('removes modality when already present', () => {
      component.form.output_modalities = ['text', 'audio'];
      component.toggleModality('audio');
      expect(component.form.output_modalities).not.toContain('audio');
      expect(component.form.output_modalities).toContain('text');
    });
  });

  describe('resetDefaults()', () => {
    it('restores defaults and shows info toast', () => {
      spyOn(toastService, 'info');
      component.form = {
        primary_disability: 'deaf',
        reading_level: 'simplified',
        output_modalities: ['haptic'],
      };

      component.resetDefaults();

      expect(component.form).toEqual(DEFAULT_PREFERENCES);
      expect(toastService.info).toHaveBeenCalledWith('Preferences reset to defaults.');
    });
  });
});
