import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CompanionComponent } from './companion.component';

describe('CompanionComponent', () => {
  let component: CompanionComponent;
  let fixture: ComponentFixture<CompanionComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CompanionComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanionComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the empty response state', () => {
    const el: HTMLElement = fixture.nativeElement;
    const muted = el.querySelector('.companion-response .muted');
    expect(muted?.textContent).toContain('Submit a photo or question');
  });

  it('validates that at least one input is required', () => {
    component.textInput = '';
    component.submit();
    expect(component.clientError()).toContain('Add a photo');
    expect(component.loading()).toBeFalse();
  });

  it('submits with text input and sends preferences', () => {
    component.textInput = 'What does this sign say?';
    component.submit();

    const req = httpMock.expectOne((r) => r.url.includes('/v1/accessibility/assist'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body.input.text).toBe('What does this sign say?');
    expect(req.request.body.user_context.preferences).toBeTruthy();
    expect(req.request.body.user_context.preferences.primary_disability).toBeDefined();

    req.flush({
      response_id: 'r1',
      primary_output: { modality: 'text', text: 'It says EXIT', audio_url: null },
      secondary_outputs: [],
      services_invoked: ['text_simplification'],
      confidence: 0.85,
      latency_ms: 120,
    });

    expect(component.loading()).toBeFalse();
    expect(component.result()?.primary_output.text).toBe('It says EXIT');
  });

  it('sends emergency flag when toggled', () => {
    component.textInput = 'Help';
    component.emergency = true;
    component.submit();

    const req = httpMock.expectOne((r) => r.url.includes('/v1/accessibility/assist'));
    expect(req.request.body.situation.urgency).toBe('emergency');
    req.flush({
      response_id: 'r2',
      primary_output: { modality: 'text', text: 'Emergency response', audio_url: null },
      secondary_outputs: [],
      services_invoked: [],
      confidence: 0.9,
      latency_ms: 50,
    });
  });

  it('displays capability_not_configured error correctly', () => {
    component.textInput = 'Describe this';
    component.submit();

    const req = httpMock.expectOne((r) => r.url.includes('/v1/accessibility/assist'));
    req.flush({ error: 'capability_not_configured', detail: 'No AI provider is set.' }, { status: 501, statusText: 'Not Implemented' });

    expect(component.loading()).toBeFalse();
    expect(component.assistError()?.error).toBe('capability_not_configured');
    expect(component.assistErrorTitle()).toBe('Capability not configured');

    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const errorEl = el.querySelector('.response-error');
    expect(errorEl?.textContent).toContain('Capability not configured');
  });

  it('renders latency and services in the response', () => {
    component.textInput = 'test';
    component.submit();

    httpMock.expectOne((r) => r.url.includes('/v1/accessibility/assist')).flush({
      response_id: 'r3',
      primary_output: { modality: 'text', text: 'Result', audio_url: null },
      secondary_outputs: [],
      services_invoked: ['ocr', 'scene_understanding'],
      confidence: 0.77,
      latency_ms: 340,
    });

    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const meta = el.querySelector('.meta-row');
    expect(meta?.textContent).toContain('ocr, scene_understanding');
    expect(meta?.textContent).toContain('340ms');
  });

  it('shows note when audio is requested but url is null', () => {
    // Set audio modality preference
    component.textInput = 'test';
    const settings = (component as any).settings;
    settings.save({ primary_disability: 'blind', reading_level: 'standard', output_modalities: ['text', 'audio'] });

    component.submit();

    httpMock.expectOne((r) => r.url.includes('/v1/accessibility/assist')).flush({
      response_id: 'r4',
      primary_output: { modality: 'text', text: 'Audio note test', audio_url: null },
      secondary_outputs: [],
      services_invoked: [],
      confidence: 0.8,
      latency_ms: 100,
    });

    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const note = el.querySelector('.note');
    expect(note?.textContent).toContain('Audio output was requested');
  });

  it('rejects non-image files', () => {
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } } as unknown as Event;
    component.onFileSelected(event);
    expect(component.clientError()).toContain('image file');
    expect(component.imagePreview()).toBeNull();
  });
});
