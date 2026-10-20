create table if not exists public.visits (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    email text not null,
    phone text not null,
    preferred_date date,
    preferred_service text,
    guests text,
    kids_ages text,
    notes text,
    status text default 'pendiente',
    created_at timestamp with time zone default now()
);

create index if not exists idx_visits_created_at on public.visits(created_at desc);
create index if not exists idx_visits_status on public.visits(status);
create index if not exists idx_visits_email on public.visits(email);

alter table public.visits enable row level security;

drop policy if exists "Anyone can insert visits" on public.visits;
create policy "Anyone can insert visits"
    on public.visits for insert
    to anon, authenticated
    with check (true);

drop policy if exists "Authenticated can view visits" on public.visits;
create policy "Authenticated can view visits"
    on public.visits for select
    to authenticated
    using (true);

drop policy if exists "Authenticated can update visits" on public.visits;
create policy "Authenticated can update visits"
    on public.visits for update
    to authenticated
    using (true)
    with check (true);

comment on table public.visits is 'Solicitudes de visita de nuevos visitantes';
