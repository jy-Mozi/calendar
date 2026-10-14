-- S0A: on signup create the profile and default categories/projects for that user.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  );

  insert into public.categories (user_id, type, name, color, sort_order)
  select new.id, c.type, c.name, c.color, c.ord
  from (values
    ('event',  '업무',   'blue',   1), ('event',  '약속',   'violet', 2),
    ('event',  '건강',   'green',  3), ('event',  '운동',   'orange', 4),
    ('event',  '기념',   'pink',   5),
    ('ledger', '식비',   'orange', 1), ('ledger', '교통',   'blue',   2),
    ('ledger', '주거',   'violet', 3), ('ledger', '통신',   'teal',   4),
    ('ledger', '쇼핑',   'pink',   5), ('ledger', '문화',   'yellow', 6),
    ('ledger', '의료',   'green',  7), ('ledger', '기타',   'gray',   8),
    ('ledger', '급여',   'green',  9)
  ) as c(type, name, color, ord);

  insert into public.projects (user_id, name, color)
  values (new.id, '업무', 'blue'), (new.id, '생활', 'green'), (new.id, '개인', 'violet');

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
