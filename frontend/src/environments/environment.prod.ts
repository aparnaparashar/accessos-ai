// In production the nginx reverse proxy (see frontend/nginx.conf, Section 10)
// serves this app and forwards /v1/* and /health to the backend service on
// the same origin, so apiBase is left empty (relative requests).
export const environment = {
  production: true,
  apiBase: '',
};
