-- weather_cache grid keys: 0.1 degree (one decimal), as the weather Edge Function upserts on (lat_key, lon_key).
-- Rows are a shared cache; if rounding to one decimal makes two rows collide, keep only the newest.
delete from public.weather_cache w
using public.weather_cache n
where round(w.lat_key, 1) = round(n.lat_key, 1)
  and round(w.lon_key, 1) = round(n.lon_key, 1)
  and (w.fetched_at, w.id) < (n.fetched_at, n.id);

alter table public.weather_cache
  alter column lat_key type numeric(5, 1),
  alter column lon_key type numeric(5, 1);
