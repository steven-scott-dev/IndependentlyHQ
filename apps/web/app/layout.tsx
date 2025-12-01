export const metadata = {
  title: "Independently",
  description: "Daily career system",
};

import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        {/* Top Navigation */}
        <header className="border-b bg-white">
          <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold">
              Independently
            </Link>

            <nav className="flex items-center gap-4 text-sm">
              <Link href="/today" className="hover:underline">
                Today
              </Link>
              <Link href="/insights" className="hover:underline">
                Insights
              </Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
