-- S0A: core schema for calendar / todo / ledger (PRM.md chapter 5)
-- All timestamps are timestamptz (UTC). Money is bigint KRW, always positive.
-- All-day events: start_at/end_at are KST (Asia/Seoul) midnight instants, end exclusive.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- tables
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  name text,
  timezone text not null default 'Asia/Seoul',
  weather_lat double precision,
  weather_lon double precision,
  weather_label text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null check (type in ('event', 'todo', 'ledger')),
  name text not null check (length(btrim(name)) > 0),
  color text,
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index categories_user_type_idx on public.categories (user_id, type, sort_order);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (length(btrim(title)) > 0),
  start_at timestamptz not null,
  end_at timestamptz not null,
  all_day boolean not null default false,
  location text,
  memo text,
  category_id uuid references public.categories (id) on delete set null,
  rrule text,
  recurrence_parent_id uuid references public.events (id) on delete cascade,
  reminders jsonb not null default '[]'::jsonb,
  google_event_id text,
  google_calendar_id text,
  etag text,
  source text not null default 'app' check (source in ('app', 'google', 'mcp')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_end_after_start check (end_at >= start_at)
);
create index events_user_start_idx on public.events (user_id, start_at);
create index events_recurrence_parent_idx on public.events (recurrence_parent_id)
  where recurrence_parent_id is not null;
create unique index events_google_unique_idx
  on public.events (user_id, google_calendar_id, google_event_id)
  where google_event_id is not null;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (length(btrim(name)) > 0),
  color text,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_user_idx on public.projects (user_id);

create table public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (length(btrim(title)) > 0),
  memo text,
  due_date date,
  priority smallint not null default 2 check (priority between 1 and 3),
  status text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  completed_at timestamptz,
  project_id uuid references public.projects (id) on delete set null,
  parent_id uuid references public.todos (id) on delete cascade,
  rrule text,
  reminders jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index todos_user_status_due_idx on public.todos (user_id, status, due_date);
create index todos_project_idx on public.todos (project_id) where project_id is not null;
create index todos_parent_idx on public.todos (parent_id) where parent_id is not null;

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (length(btrim(name)) > 0),
  type text not null check (type in ('cash', 'bank', 'card')),
  initial_balance bigint not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index accounts_user_idx on public.accounts (user_id);

create table public.recurring_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null check (type in ('income', 'expense', 'transfer')),
  amount bigint not null check (amount > 0),
  category_id uuid references public.categories (id) on delete set null,
  account_id uuid references public.accounts (id) on delete set null,
  to_account_id uuid references public.accounts (id) on delete set null,
  memo text,
  rrule text not null,
  next_run_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index recurring_user_next_idx on public.recurring_transactions (user_id, next_run_at)
  where active;

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null check (type in ('income', 'expense', 'transfer')),
  amount bigint not null check (amount > 0),
  date date not null,
  category_id uuid references public.categories (id) on delete set null,
  account_id uuid references public.accounts (id) on delete set null,
  to_account_id uuid references public.accounts (id) on delete set null,
  memo text,
  recurring_id uuid references public.recurring_transactions (id) on delete set null,
  receipt_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transactions_transfer_needs_target
    check (type <> 'transfer' or (to_account_id is not null and to_account_id is distinct from account_id))
);
create index transactions_user_date_idx on public.transactions (user_id, date);
create index transactions_account_idx on public.transactions (account_id) where account_id is not null;
create index transactions_category_idx on public.transactions (category_id) where category_id is not null;

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  month date not null check (month = date_trunc('month', month)::date),
  amount bigint not null check (amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category_id, month)
);

-- tokens: ciphertext only, never plaintext (see HANDOFF). Hidden from client roles below.
create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  provider text not null check (length(btrim(provider)) > 0),
  tokens text,
  selected_calendars jsonb not null default '[]'::jsonb,
  sync_tokens jsonb not null default '{}'::jsonb,
  channel_id text,
  channel_expires_at timestamptz,
  last_synced_at timestamptz,
  status text not null default 'disconnected',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

-- shared cache, no user_id: service role only
create table public.weather_cache (
  id uuid primary key default gen_random_uuid(),
  lat_key numeric(6, 2) not null,
  lon_key numeric(6, 2) not null,
  payload jsonb not null,
  fetched_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lat_key, lon_key)
);

-- token_hash: hidden from client roles below
create table public.mcp_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (length(btrim(name)) > 0),
  token_hash text not null unique,
  scopes text[] not null default array['read']::text[],
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mcp_tokens_scopes_valid check (scopes <@ array['read', 'write']::text[])
);
create index mcp_tokens_user_idx on public.mcp_tokens (user_id);

create table public.mcp_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  token_id uuid references public.mcp_tokens (id) on delete set null,
  tool text not null,
  success boolean not null,
  error text,
  called_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index mcp_logs_user_called_idx on public.mcp_logs (user_id, called_at desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind text not null,
  ref_id uuid,
  scheduled_at timestamptz not null,
  sent_at timestamptz,
  channel text not null default 'webpush',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index notifications_due_idx on public.notifications (scheduled_at) where sent_at is null;
create index notifications_user_idx on public.notifications (user_id);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'categories', 'events', 'projects', 'todos', 'accounts',
    'transactions', 'recurring_transactions', 'budgets', 'integrations',
    'weather_cache', 'mcp_tokens', 'mcp_logs', 'notifications'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS: user_id = auth.uid() for select/insert/update/delete
-- mcp_logs is written only by the service role, so clients get select/delete only.
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'categories', 'events', 'projects', 'todos', 'accounts',
    'transactions', 'recurring_transactions', 'budgets', 'integrations',
    'mcp_tokens', 'mcp_logs', 'notifications'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy %I on public.%I for select to authenticated
         using (user_id = (select auth.uid()))', t || '_select_own', t);
    execute format(
      'create policy %I on public.%I for delete to authenticated
         using (user_id = (select auth.uid()))', t || '_delete_own', t);
    if t <> 'mcp_logs' then
      execute format(
        'create policy %I on public.%I for insert to authenticated
           with check (user_id = (select auth.uid()))', t || '_insert_own', t);
      execute format(
        'create policy %I on public.%I for update to authenticated
           using (user_id = (select auth.uid()))
           with check (user_id = (select auth.uid()))', t || '_update_own', t);
    end if;
  end loop;
end;
$$;

-- weather_cache: RLS on, no policies, no grants -> only service_role can touch it
alter table public.weather_cache enable row level security;
revoke all on public.weather_cache from anon, authenticated;

-- anon never touches app data
revoke all on
  public.profiles, public.categories, public.events, public.projects, public.todos,
  public.accounts, public.transactions, public.recurring_transactions, public.budgets,
  public.integrations, public.mcp_tokens, public.mcp_logs, public.notifications
  from anon;

-- mcp_logs is read-only (+delete) for clients
revoke insert, update on public.mcp_logs from authenticated;

-- secrets are never readable/writable from the browser: column-level grants
revoke select on public.integrations from authenticated;
grant select (id, user_id, provider, selected_calendars, sync_tokens, channel_id,
              channel_expires_at, last_synced_at, status, created_at, updated_at)
  on public.integrations to authenticated;
revoke insert, update on public.integrations from authenticated;
grant update (selected_calendars, status) on public.integrations to authenticated;

revoke select on public.mcp_tokens from authenticated;
grant select (id, user_id, name, scopes, last_used_at, revoked_at, created_at, updated_at)
  on public.mcp_tokens to authenticated;
revoke insert, update on public.mcp_tokens from authenticated;
grant update (name, revoked_at) on public.mcp_tokens to authenticated;
-- token creation (hash generation) and integration rows are written by Edge Functions (service role)
