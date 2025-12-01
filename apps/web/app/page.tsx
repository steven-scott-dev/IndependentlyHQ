import Link from "next/link";

export default function Home() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Independently</h1>
      <p>Grow your career in 10 minutes a day.</p>
      <div className="flex gap-3">
        <Link className="underline" href="/(site)/today">Go to Today</Link>
        <a className="underline" href="/api/auth/callback">Sign in</a>
      </div>
    </main>
  );
}
