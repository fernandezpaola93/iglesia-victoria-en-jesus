-- TABLA: visits (Visitas / Planifica tu visita)
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

-- Índices
create index idx_visits_created_at on public.visits(created_at desc);
create index idx_visits_status on public.visits(status);
create index idx_visits_email on public.visits(email);

-- Habilitar RLS
alter table public.visits enable row level security;

-- Política: Cualquiera (incluso anónimos) puede insertar visitas
create policy "Anyone can insert visits"
    on public.visits for insert
    to anon, authenticated
    with check (true);

-- Política: Solo autenticados pueden ver visitas (para el dashboard/admin)
create policy "Authenticated can view visits"
    on public.visits for select
    to authenticated
    using (true);

-- Comentario
comment on table public.visits is 'Solicitudes de visita de nuevos visitantes (formulario público)';
