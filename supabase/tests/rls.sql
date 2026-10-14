-- RLS isolation test. Runs against the (dev-only) remote DB inside one transaction that is always rolled back,
-- so no test users or rows remain. Run with the DB connection string from your own env:
--   psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls.sql
begin;

insert into auth.users (id, instance_id, aud, role, email)
values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a@test.local'),
  ('00000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'b@test.local');

-- one row per table, owned by user B (inserted as superuser)
insert into public.categories (id, user_id, type, name) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000000b2', 'event', 'b-cat');
insert into public.accounts (id, user_id, name, type) values
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-0000000000b2', 'b-acc', 'bank');
insert into public.events (id, user_id, title, start_at, end_at) values
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-0000000000b2', 'b-ev', now(), now());
insert into public.projects (id, user_id, name) values
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-0000000000b2', 'b-proj');
insert into public.todos (id, user_id, title) values
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-0000000000b2', 'b-todo');
insert into public.transactions (id, user_id, type, amount, date) values
  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-0000000000b2', 'expense', 1000, current_date);
insert into public.recurring_transactions (id, user_id, type, amount, rrule) values
  ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-0000000000b2', 'expense', 1000, 'FREQ=MONTHLY');
insert into public.budgets (id, user_id, category_id, month, amount) values
  ('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-0000000000b2',
   '10000000-0000-0000-0000-000000000001', date_trunc('month', current_date)::date, 1000);
insert into public.integrations (id, user_id, provider) values
  ('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-0000000000b2', 'google');
insert into public.mcp_tokens (id, user_id, name, token_hash) values
  ('10000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-0000000000b2', 'b-token', 'hash-b');
insert into public.mcp_logs (id, user_id, tool, success) values
  ('10000000-0000-0000-0000-00000000000b', '00000000-0000-0000-0000-0000000000b2', 'list_events', true);
insert into public.notifications (id, user_id, kind, scheduled_at) values
  ('10000000-0000-0000-0000-00000000000c', '00000000-0000-0000-0000-0000000000b2', 'event', now());
insert into public.weather_cache (lat_key, lon_key, payload) values (37.57, 126.98, '{}'::jsonb);

-- act as user A
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

do $$
declare
  t text;
  n int;
  leaked int := 0;
  tables text[] := array[
    'profiles', 'categories', 'events', 'projects', 'todos', 'accounts',
    'transactions', 'recurring_transactions', 'budgets', 'integrations',
    'mcp_tokens', 'mcp_logs', 'notifications'
  ];
  b constant uuid := '00000000-0000-0000-0000-0000000000b2';
begin
  foreach t in array tables loop
    -- select: A must see none of B's rows
    execute format('select count(*) from public.%I where user_id = $1', t) into n using b;
    if n > 0 then raise warning 'LEAK select on %: % rows', t, n; leaked := leaked + n; end if;

    -- update / delete: must affect 0 rows
    if t not in ('integrations', 'mcp_tokens', 'mcp_logs') then
      execute format('update public.%I set updated_at = now() where user_id = $1', t) using b;
      get diagnostics n = row_count;
      if n > 0 then raise warning 'LEAK update on %: % rows', t, n; leaked := leaked + n; end if;
    end if;
    execute format('delete from public.%I where user_id = $1', t) using b;
    get diagnostics n = row_count;
    if n > 0 then raise warning 'LEAK delete on %: % rows', t, n; leaked := leaked + n; end if;
  end loop;

  -- insert as B must be rejected by with check
  begin
    insert into public.todos (user_id, title) values (b, 'forged');
    raise warning 'LEAK insert on todos as another user';
    leaked := leaked + 1;
  exception when insufficient_privilege or check_violation then
    null;
  end;

  -- weather_cache is closed to clients
  begin
    perform 1 from public.weather_cache;
    raise warning 'LEAK weather_cache readable by authenticated';
    leaked := leaked + 1;
  exception when insufficient_privilege then
    null;
  end;

  -- secret columns are not selectable
  begin
    perform tokens from public.integrations;
    raise warning 'LEAK integrations.tokens readable';
    leaked := leaked + 1;
  exception when insufficient_privilege then
    null;
  end;
  begin
    perform token_hash from public.mcp_tokens;
    raise warning 'LEAK mcp_tokens.token_hash readable';
    leaked := leaked + 1;
  exception when insufficient_privilege then
    null;
  end;

  if leaked > 0 then
    raise exception 'RLS test FAILED: % violations', leaked;
  end if;
  raise notice 'RLS test passed: 0 cross-user accesses';
end;
$$;

rollback;
