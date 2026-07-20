import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isLoggedIn() returns false when no tokens exist', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  describe('signup()', () => {
    it('persists tokens and user on success', () => {
      const mockResponse = {
        access_token: 'at-123',
        refresh_token: 'rt-456',
        token_type: 'bearer',
        user: { id: 'u1', email: 'a@b.com', full_name: 'Test', role: 'end_user' as const },
      };

      service.signup({ email: 'a@b.com', password: 'pass123', full_name: 'Test', role: 'end_user' }).subscribe((res) => {
        expect(res.access_token).toBe('at-123');
      });

      const req = httpMock.expectOne((r) => r.url.includes('/v1/auth/signup'));
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      expect(service.getAccessToken()).toBe('at-123');
      expect(service.isLoggedIn()).toBeTrue();
      expect(service.user()).toEqual(mockResponse.user);
      expect(localStorage.getItem('accessos_refresh_token')).toBe('rt-456');
    });
  });

  describe('login()', () => {
    it('persists tokens on success', () => {
      const mockResponse = {
        access_token: 'at-789',
        refresh_token: 'rt-012',
        token_type: 'bearer',
        user: { id: 'u2', email: 'b@c.com', full_name: 'User2', role: 'developer' as const },
      };

      service.login({ email: 'b@c.com', password: 'pass' }).subscribe();

      const req = httpMock.expectOne((r) => r.url.includes('/v1/auth/login'));
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      expect(service.getAccessToken()).toBe('at-789');
      expect(service.user()?.email).toBe('b@c.com');
    });
  });

  describe('refresh()', () => {
    it('updates access token on success', () => {
      localStorage.setItem('accessos_refresh_token', 'rt-old');

      service.refresh().subscribe();

      const req = httpMock.expectOne((r) => r.url.includes('/v1/auth/refresh'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body.refresh_token).toBe('rt-old');
      req.flush({ access_token: 'at-new', token_type: 'bearer' });

      expect(service.getAccessToken()).toBe('at-new');
    });

    it('returns error and calls logout when no refresh token', () => {
      service.refresh().subscribe({
        error: (err) => expect(err.message).toBe('no_refresh_token'),
      });
    });

    it('calls logout on refresh failure', () => {
      localStorage.setItem('accessos_refresh_token', 'rt-expired');
      spyOn(service, 'logout').and.callThrough();

      service.refresh().subscribe({ error: () => {} });

      const req = httpMock.expectOne((r) => r.url.includes('/v1/auth/refresh'));
      req.flush({ error: 'invalid' }, { status: 401, statusText: 'Unauthorized' });

      expect(service.logout).toHaveBeenCalled();
      expect(service.isLoggedIn()).toBeFalse();
    });
  });

  describe('logout()', () => {
    it('clears all auth state', () => {
      localStorage.setItem('accessos_refresh_token', 'rt');
      localStorage.setItem('accessos_user', '{"id":"u"}');

      service.logout();

      expect(service.getAccessToken()).toBeNull();
      expect(service.user()).toBeNull();
      expect(service.isLoggedIn()).toBeFalse();
      expect(localStorage.getItem('accessos_refresh_token')).toBeNull();
      expect(localStorage.getItem('accessos_user')).toBeNull();
    });
  });

  describe('currentRole()', () => {
    it('returns null when not logged in', () => {
      expect(service.currentRole()).toBeNull();
    });

    it('returns role after login', () => {
      service.login({ email: 'x@y.com', password: 'p' }).subscribe();

      httpMock.expectOne((r) => r.url.includes('/v1/auth/login')).flush({
        access_token: 'at',
        refresh_token: 'rt',
        token_type: 'bearer',
        user: { id: 'u', email: 'x@y.com', full_name: 'X', role: 'developer' },
      });

      expect(service.currentRole()).toBe('developer');
    });
  });
});
