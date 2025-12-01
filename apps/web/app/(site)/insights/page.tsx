// apps/web/app/insights/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights | Independently",
  description: "Quick market scan: news, salary signals, and people to know.",
};

type NewsItem = {
  id: string;
  title: string;
  summary?: string | null;
  url: string;
  source?: string | null;
  topic?: string | null;
  published_at?: string | null;
};

type JobInsight = {
  id: string;
  title: string;
  company?: string | null;
  location?: string | null;
  salary_low?: number | null;
  salary_high?: number | null;
  currency?: string | null;
};

type WhoPerson = {
  id: string;
  full_name: string;
  headline?: string | null;
  company?: string | null;
  role?: string | null;
  location?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
  avatar_url?: string | null;
};

type WhoMatch = {
  id: string;
  reason?: string | null;
  match_score?: number | null;
  contact_type?: string | null;
  who_to_know?: WhoPerson | null;
};

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }

  return res.json();
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function InsightsPage() {
  // Hit your own API routes
  const [newsRes, jobsRes, whoRes] = await Promise.all([
    fetchJSON<{ items: NewsItem[] }>("/api/insights/news"),
    fetchJSON<{ items: JobInsight[] }>("/api/insights/jobs"),
    fetchJSON<{ items: WhoMatch[] }>("/api/insights/who-to-know"),
  ]);

  const news = newsRes.items ?? [];
  const jobs = jobsRes.items ?? [];
  const who = whoRes.items ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Insights & Signals
        </h1>
        <p className="text-sm text-muted-foreground">
          A 10-second scan of your market: news, salary ranges, and people who
          can move you faster.
        </p>
      </header>

      {/* Top section: News + Salary Snapshot */}
      <div className="grid gap-6 md:grid-cols-3 items-start">
        {/* News */}
        <section className="md:col-span-2 rounded-xl border bg-card p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Top News</h2>
            <span className="text-xs text-muted-foreground">
              Powered by your career profile
            </span>
          </div>

          {news.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No news yet. Once the worker starts filling{" "}
              <code className="text-xs">news_items</code>, you&apos;ll see
              curated stories here.
            </p>
          ) : (
            <ul className="space-y-3">
              {news.map((item) => (
                <li
                  key={item.id}
                  className="border-b last:border-b-0 pb-3 last:pb-0"
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium hover:underline"
                  >
                    {item.title}
                  </a>

                  {item.summary && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {item.summary}
                    </p>
                  )}

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {item.source && <span>{item.source}</span>}
                    {item.topic && <span>• {item.topic}</span>}
                    {formatDate(item.published_at) && (
                      <span>• {formatDate(item.published_at)}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Salary Snapshot */}
        <section className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold">Salary Snapshot</h2>

          {jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No salary data yet. Insert a few rows into{" "}
              <code className="text-xs">job_insights</code> to preview this
              widget.
            </p>
          ) : (
            <ul className="space-y-3">
              {jobs.map((job) => (
                <li key={job.id} className="text-sm">
                  <div className="font-medium">
                    {job.title}
                    {job.company && (
                      <span className="text-muted-foreground">
                        {" "}
                        @ {job.company}
                      </span>
                    )}
                  </div>

                  {job.salary_low != null && job.salary_high != null && (
                    <div className="text-xs text-muted-foreground">
                      {(job.currency ?? "USD").toUpperCase()}{" "}
                      {job.salary_low.toLocaleString()}–{" "}
                      {job.salary_high.toLocaleString()}
                    </div>
                  )}

                  {job.location && (
                    <div className="text-xs text-muted-foreground">
                      {job.location}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Who To Know */}
      <section className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">Who To Know</h2>
            <p className="text-xs text-muted-foreground">
              High-signal humans: mentors, peers, and recruiters aligned with
              your stack and goals.
            </p>
          </div>
        </div>

        {who.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No matches yet. Once your resume and skills are processed and{" "}
            <code className="text-xs">who_to_know</code> +
            <code className="text-xs">who_to_know_matches</code> are populated,
            recommendations will appear here.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {who.map((match) => {
              const person = match.who_to_know;
              if (!person) return null;

              return (
                <article
                  key={match.id}
                  className="flex flex-col gap-2 rounded-lg border bg-background p-3"
                >
                  <div className="flex items-center gap-3">
                    {person.avatar_url ? (
                      <img
                        src={person.avatar_url}
                        alt={person.full_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {person.full_name?.[0] ?? "?"}
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-medium">
                        {person.full_name}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {person.headline ||
                          [person.role, person.company]
                            .filter(Boolean)
                            .join(" @ ")}
                      </div>
                    </div>
                  </div>

                  {match.reason && (
                    <p className="mt-1 border-t pt-2 text-xs text-muted-foreground line-clamp-3">
                      {match.reason}
                    </p>
                  )}

                  <div className="mt-auto flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    {match.contact_type && (
                      <span className="rounded-full border px-2 py-0.5">
                        {match.contact_type}
                      </span>
                    )}
                    {typeof match.match_score === "number" && (
                      <span>
                        Match: {(match.match_score * 100).toFixed(0)}%
                      </span>
                    )}
                    {person.location && <span>• {person.location}</span>}
                  </div>

                  <div className="mt-2 flex gap-2">
                    {person.linkedin_url && (
                      <a
                        href={person.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium underline"
                      >
                        View LinkedIn
                      </a>
                    )}
                    {person.website_url && (
                      <a
                        href={person.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium underline"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
