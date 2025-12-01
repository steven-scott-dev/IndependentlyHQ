export const metadata = { title: "Independently", description: "Daily career system" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <div className="max-w-3xl mx-auto p-4">{children}</div>
      </body>
    </html>
  );
}
