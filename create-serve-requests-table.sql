-- TABLA: serve_requests (Solicitudes de voluntariado / Quiero servir)
create table if not exists public.serve_requests (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    email text not null,
    phone text,
    areas text[] not null default '{}',
    experience text,
    availability text,
    status text default 'pendiente',
    created_at timestamp with time zone default now()
);

create index if not exists idx_serve_requests_created_at on public.serve_requests(created_at desc);
create index if not exists idx_serve_requests_status on public.serve_requests(status);
create index if not exists idx_serve_requests_email on public.serve_requests(email);

alter table public.serve_requests enable row level security;

drop policy if exists "Anyone can insert serve requests" on public.serve_requests;
create policy "Anyone can insert serve requests"
    on public.serve_requests for insert
    to anon, authenticated
    with check (true);

drop policy if exists "Authenticated can view all serve requests" on public.serve_requests;
create policy "Authenticated can view all serve requests"
    on public.serve_requests for select
    to authenticated
    using (true);

drop policy if exists "Authenticated can update serve requests" on public.serve_requests;
create policy "Authenticated can update serve requests"
    on public.serve_requests for update
    to authenticated
    using (true)
    with check (true);

comment on table public.serve_requests is 'Solicitudes de voluntariado de la congregación';
