export default function Home() {
  return (
    <main style={{ fontFamily: "monospace", padding: "2rem" }}>
      <h1>AccessOS AI — Backend</h1>
      <p>This Next.js service exposes the platform&apos;s API layer only. See README.md for the route list.</p>
      <ul>
        <li>GET /health</li>
        <li>POST /v1/auth/signup</li>
        <li>POST /v1/auth/login</li>
        <li>POST /v1/auth/refresh</li>
        <li>POST /v1/accessibility/assist</li>
        <li>GET /v1/accessibility/health</li>
      </ul>
    </main>
  );
}
