import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type PlanName = 'free' | 'starter' | 'pro';

export interface Application {
  _id: string;
  owner: string;
  name: string;
  plan: PlanName;
  allowed_apis: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiKeyMeta {
  _id: string;
  application: string;
  client_id: string;
  ip_allowlist: string[];
  revoked: boolean;
  last_used_at: string | null;
  createdAt: string;
}

export interface GeneratedKey {
  key_id: string;
  client_id: string;
  secret_key: string;
  warning: string;
}

export interface AnalyticsResponse {
  total_calls: number;
  calls_by_api: { api: string; calls: number; average_latency_ms: number }[];
  average_latency_ms: number;
  success_rate: number | null;
  calls_per_day: { date: string; calls: number }[];
}

export interface BillingUsageResponse {
  billing_period_start: string;
  line_items: { api: string; calls: number; unit: string; estimated_charge_usd: number; note: string }[];
  estimated_total_usd: number;
  disclaimer: string;
}

export interface AuditEntry {
  _id: string;
  actor: string;
  action: string;
  detail: Record<string, unknown>;
  ip: string;
  createdAt: string;
}

export interface AuditResponse {
  entries: AuditEntry[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export const ALLOWED_API_VALUES = ['ocr', 'accessibility.assist'] as const;

/**
 * Wraps every real Developer Platform endpoint documented in
 * NEXT_STEPS_PROMPT.md Section 3. All calls go through the Angular
 * `authInterceptor`, which attaches the Bearer access token automatically —
 * these methods don't need to handle auth headers themselves.
 */
@Injectable({ providedIn: 'root' })
export class DevService {
  private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  // --- Applications ---
  listApplications(): Observable<{ applications: Application[] }> {
    return this.http.get<{ applications: Application[] }>(`${this.base}/v1/developer/applications`);
  }

  createApplication(payload: { name: string; plan?: PlanName; allowed_apis?: string[] }): Observable<{ application: Application }> {
    return this.http.post<{ application: Application }>(`${this.base}/v1/developer/applications`, payload);
  }

  updateApplication(id: string, payload: Partial<{ name: string; plan: PlanName; allowed_apis: string[] }>): Observable<{ application: Application }> {
    return this.http.patch<{ application: Application }>(`${this.base}/v1/developer/applications/${id}`, payload);
  }

  // --- Keys ---
  listKeys(applicationId: string): Observable<{ keys: ApiKeyMeta[] }> {
    return this.http.get<{ keys: ApiKeyMeta[] }>(`${this.base}/v1/developer/applications/${applicationId}/keys`);
  }

  generateKey(applicationId: string): Observable<GeneratedKey> {
    return this.http.post<GeneratedKey>(`${this.base}/v1/developer/applications/${applicationId}/keys`, {});
  }

  rotateKey(applicationId: string, keyId: string): Observable<GeneratedKey> {
    return this.http.post<GeneratedKey>(`${this.base}/v1/developer/applications/${applicationId}/keys/${keyId}/rotate`, {});
  }

  revokeKey(applicationId: string, keyId: string): Observable<{ key_id: string; revoked: boolean }> {
    return this.http.delete<{ key_id: string; revoked: boolean }>(`${this.base}/v1/developer/applications/${applicationId}/keys/${keyId}`);
  }

  // --- Analytics / Billing / Audit ---
  getAnalytics(): Observable<AnalyticsResponse> {
    return this.http.get<AnalyticsResponse>(`${this.base}/v1/analytics`);
  }

  getBillingUsage(): Observable<BillingUsageResponse> {
    return this.http.get<BillingUsageResponse>(`${this.base}/v1/billing/usage`);
  }

  createCheckout(plan: 'starter' | 'pro'): Observable<{ checkout_url: string; session_id: string }> {
    return this.http.post<{ checkout_url: string; session_id: string }>(`${this.base}/v1/billing/checkout`, { plan });
  }

  getAudit(page = 1, pageSize = 20): Observable<AuditResponse> {
    return this.http.get<AuditResponse>(`${this.base}/v1/audit`, { params: { page, page_size: pageSize } as any });
  }
}
