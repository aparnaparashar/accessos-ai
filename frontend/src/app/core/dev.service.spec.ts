import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DevService } from './dev.service';

describe('DevService', () => {
  let service: DevService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DevService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- Applications ---

  describe('listApplications()', () => {
    it('sends GET to /v1/developer/applications', () => {
      service.listApplications().subscribe((res) => {
        expect(res.applications.length).toBe(1);
      });

      const req = httpMock.expectOne((r) => r.url.includes('/v1/developer/applications') && r.method === 'GET');
      req.flush({ applications: [{ _id: 'a1', name: 'Test', plan: 'free', allowed_apis: ['ocr'], owner: 'u1', createdAt: '', updatedAt: '' }] });
    });
  });

  describe('createApplication()', () => {
    it('sends POST with body', () => {
      const payload = { name: 'My App', plan: 'starter' as const, allowed_apis: ['ocr'] };

      service.createApplication(payload).subscribe((res) => {
        expect(res.application.name).toBe('My App');
      });

      const req = httpMock.expectOne((r) => r.url.includes('/v1/developer/applications') && r.method === 'POST');
      expect(req.request.body).toEqual(payload);
      req.flush({ application: { _id: 'a2', name: 'My App', plan: 'starter', allowed_apis: ['ocr'], owner: 'u1', createdAt: '', updatedAt: '' } });
    });
  });

  describe('updateApplication()', () => {
    it('sends PATCH to /v1/developer/applications/:id', () => {
      service.updateApplication('a1', { name: 'Renamed' }).subscribe();

      const req = httpMock.expectOne((r) => r.url.includes('/v1/developer/applications/a1') && r.method === 'PATCH');
      expect(req.request.body).toEqual({ name: 'Renamed' });
      req.flush({ application: { _id: 'a1', name: 'Renamed', plan: 'free', allowed_apis: [], owner: 'u1', createdAt: '', updatedAt: '' } });
    });
  });

  // --- Keys ---

  describe('listKeys()', () => {
    it('sends GET to /applications/:id/keys', () => {
      service.listKeys('a1').subscribe((res) => {
        expect(res.keys).toEqual([]);
      });

      const req = httpMock.expectOne((r) => r.url.includes('/v1/developer/applications/a1/keys') && r.method === 'GET');
      req.flush({ keys: [] });
    });
  });

  describe('generateKey()', () => {
    it('sends POST to /applications/:id/keys', () => {
      service.generateKey('a1').subscribe((res) => {
        expect(res.secret_key).toBe('sk-abc');
      });

      const req = httpMock.expectOne((r) => r.url.includes('/v1/developer/applications/a1/keys') && r.method === 'POST');
      req.flush({ key_id: 'k1', client_id: 'cid1', secret_key: 'sk-abc', warning: 'copy now' });
    });
  });

  describe('rotateKey()', () => {
    it('sends POST to /keys/:keyId/rotate', () => {
      service.rotateKey('a1', 'k1').subscribe((res) => {
        expect(res.secret_key).toBeTruthy();
      });

      const req = httpMock.expectOne((r) => r.url.includes('/v1/developer/applications/a1/keys/k1/rotate') && r.method === 'POST');
      req.flush({ key_id: 'k1', client_id: 'cid1', secret_key: 'sk-new', warning: 'copy now' });
    });
  });

  describe('revokeKey()', () => {
    it('sends DELETE to /keys/:keyId', () => {
      service.revokeKey('a1', 'k1').subscribe((res) => {
        expect(res.revoked).toBeTrue();
      });

      const req = httpMock.expectOne((r) => r.url.includes('/v1/developer/applications/a1/keys/k1') && r.method === 'DELETE');
      req.flush({ key_id: 'k1', revoked: true });
    });
  });

  // --- Analytics / Billing / Audit ---

  describe('getAnalytics()', () => {
    it('sends GET to /v1/analytics', () => {
      service.getAnalytics().subscribe((res) => {
        expect(res.total_calls).toBe(42);
      });

      const req = httpMock.expectOne((r) => r.url.includes('/v1/analytics'));
      expect(req.request.method).toBe('GET');
      req.flush({ total_calls: 42, calls_by_api: [], average_latency_ms: 100, success_rate: 0.95, calls_per_day: [] });
    });
  });

  describe('getBillingUsage()', () => {
    it('sends GET to /v1/billing/usage', () => {
      service.getBillingUsage().subscribe((res) => {
        expect(res.estimated_total_usd).toBe(0);
      });

      const req = httpMock.expectOne((r) => r.url.includes('/v1/billing/usage'));
      expect(req.request.method).toBe('GET');
      req.flush({ billing_period_start: '', line_items: [], estimated_total_usd: 0, disclaimer: '' });
    });
  });

  describe('createCheckout()', () => {
    it('sends POST to /v1/billing/checkout with plan', () => {
      service.createCheckout('pro').subscribe();

      const req = httpMock.expectOne((r) => r.url.includes('/v1/billing/checkout'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ plan: 'pro' });
      req.flush({ checkout_url: 'https://stripe.com/session/xyz', session_id: 'ses_123' });
    });
  });

  describe('getAudit()', () => {
    it('sends GET with page params', () => {
      service.getAudit(2, 10).subscribe((res) => {
        expect(res.page).toBe(2);
      });

      const req = httpMock.expectOne((r) => r.url.includes('/v1/audit'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('page_size')).toBe('10');
      req.flush({ entries: [], page: 2, page_size: 10, total: 0, total_pages: 0 });
    });
  });
});
