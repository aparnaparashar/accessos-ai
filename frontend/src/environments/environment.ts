export const environment = {
  production: false,
  // Empty string = use Angular dev proxy (proxy.conf.json).
  // Never set this to an absolute URL in dev — that causes cross-origin
  // requests from the browser which are blocked by CORS. The proxy forwards
  // /v1/* to http://localhost:8000 server-side, so no CORS headers are needed.
  apiBase: '',
};
