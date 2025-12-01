create extension if not exists "uuid-ossp";

create type role_type_enum as enum ('individual','manager','admin');
create type plan_status_enum as enum ('active','completed','paused');
create type mission_status_enum as enum ('pending','today','completed');

create table if not exists public.users (
  id uuid primary key,
  email text unique not null,
  name text,
  role_type role_type_enum default 'individual' not null,
  created_at timestamptz default now() not null
);
create index if not exists idx_users_email on public.users(email);

create table if not exists public.profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  headline text,
  location text,
  goal_role_id uuid,
  preferences jsonb default '{}'::jsonb
);

create table if not exists public.roles (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  tags text[] default '{}',
  seniority_level int default 1
);

create table if not exists public.skills (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null
);

create table if not exists public.role_skill_requirements (
  id uuid primary key default uuid_generate_v4(),
  role_id uuid not null references public.roles(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  min_level int default 3
);
create index if not exists idx_rsr_role on public.role_skill_requirements(role_id);

create table if not exists public.user_skills (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  level int check (level between 0 and 5),
  updated_at timestamptz default now()
);
create unique index if not exists uniq_user_skill on public.user_skills(user_id, skill_id);
create index if not exists idx_user_skills_user on public.user_skills(user_id);

create table if not exists public.resumes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  file_url text not null,
  parsed_json jsonb,
  created_at timestamptz default now()
);

create table if not exists public.plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  goal_role_id uuid references public.roles(id),
  start_date date not null,
  end_date date not null,
  status plan_status_enum default 'active' not null
);
create index if not exists idx_plans_user on public.plans(user_id);

create table if not exists public.plan_weeks (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  week_number int not null,
  milestone text
);
create unique index if not exists uniq_plan_week on public.plan_weeks(plan_id, week_number);

create table if not exists public.missions (
  id uuid primary key default uuid_generate_v4(),
  plan_week_id uuid not null references public.plan_weeks(id) on delete cascade,
  title text not null,
  description text,
  est_minutes int default 10,
  status mission_status_enum default 'pending',
  completed_at timestamptz
);
create index if not exists idx_missions_status on public.missions(status);

create table if not exists public.streaks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references public.users(id) on delete cascade,
  current_streak int default 0,
  longest_streak int default 0,
  last_completed_at date
);

create table if not exists public.progress_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  meta jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_progress_user_date on public.progress_events(user_id, created_at desc);

alter table public.users           enable row level security;
alter table public.profiles        enable row level security;
alter table public.resumes         enable row level security;
alter table public.plans           enable row level security;
alter table public.plan_weeks      enable row level security;
alter table public.missions        enable row level security;
alter table public.user_skills     enable row level security;
alter table public.progress_events enable row level security;

create policy users_self     on public.users           for select using (id = auth.uid());
create policy profiles_self  on public.profiles        for all    using (user_id = auth.uid());
create policy resumes_self   on public.resumes         for all    using (user_id = auth.uid());
create policy plans_self     on public.plans           for all    using (user_id = auth.uid());
create policy plan_weeks_sel on public.plan_weeks      for select using (exists(select 1 from public.plans p where p.id = plan_id and p.user_id = auth.uid()));
create policy missions_sel   on public.missions        for select using (exists(select 1 from public.plan_weeks pw join public.plans p on p.id = pw.plan_id where pw.id = plan_week_id and p.user_id = auth.uid()));
create policy user_sk_self   on public.user_skills     for all    using (user_id = auth.uid());
create policy pe_self        on public.progress_events for select using (user_id = auth.uid());
