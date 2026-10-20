-- TABLA: prayer_requests (Peticiones de Oración)
create table if not exists public.prayer_requests (
    id uuid primary key default uuid_generate_v4(),
    name text,
    email text,
    request text not null,
    is_public boolean default false,
    status text default 'pendiente',
    created_at timestamp with time zone default now()
);

create index if not exists idx_prayer_requests_created_at on public.prayer_requests(created_at desc);
create index if not exists idx_prayer_requests_public on public.prayer_requests(is_public);
create index if not exists idx_prayer_requests_status on public.prayer_requests(status);

alter table public.prayer_requests enable row level security;

-- Cualquiera puede insertar peticiones
drop policy if exists "Anyone can insert prayer requests" on public.prayer_requests;
create policy "Anyone can insert prayer requests"
    on public.prayer_requests for insert
    to anon, authenticated
    with check (true);

-- Cualquiera puede ver solo las públicas
drop policy if exists "Anyone can view public prayer requests" on public.prayer_requests;
create policy "Anyone can view public prayer requests"
    on public.prayer_requests for select
    to anon, authenticated
    using (is_public = true);

-- Solo autenticados pueden ver todas (admin/líderes)
drop policy if exists "Authenticated can view all prayer requests" on public.prayer_requests;
create policy "Authenticated can view all prayer requests"
    on public.prayer_requests for select
    to authenticated
    using (true);

-- Solo autenticados pueden actualizar estado
drop policy if exists "Authenticated can update prayer requests" on public.prayer_requests;
create policy "Authenticated can update prayer requests"
    on public.prayer_requests for update
    to authenticated
    using (true)
    with check (true);

comment on table public.prayer_requests is 'Peticiones de oración de la congregación';
