export const metadata = {
  title: "AccessOS AI — API Layer",
  description: "Auth Service + Accessibility Orchestrator (Next.js API layer)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
