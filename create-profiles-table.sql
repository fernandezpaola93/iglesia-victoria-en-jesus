-- ============================================
-- TABLA: profiles (Sync con auth.users)
-- ============================================
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    avatar_url text,
    role text check (role in ('admin', 'pastor', 'lider', 'miembro')) default 'miembro',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Habilitar RLS
alter table public.profiles enable row level security;

-- Políticas: usuarios ven su propio perfil, admins ven todos
create policy "Users can view own profile"
    on public.profiles for select
    to authenticated
    using (id = auth.uid());

create policy "Admins can view all profiles"
    on public.profiles for select
    to authenticated
    using (exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
    ));

create policy "Admins can manage profiles"
    on public.profiles for all
    to authenticated
    using (exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
    ))
    with check (exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
    ));

-- Trigger para crear profile automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
    insert into public.profiles (id, full_name, avatar_url, role)
    values (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url',
        'miembro'
    );
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Función para actualizar updated_at
create or replace function public.update_updated_at_column()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger update_profiles_updated_at
    before update on public.profiles
    for each row execute function public.update_updated_at_column();

-- Índice para búsquedas por role
create index idx_profiles_role on public.profiles(role);