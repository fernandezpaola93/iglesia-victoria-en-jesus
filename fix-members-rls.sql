-- 1. Función helper is_admin (si no existe)
create or replace function public.is_admin()
returns boolean language plpgsql security definer set search_path = public as $$
declare
    v_role text;
begin
    select role into v_role from public.profiles where id = auth.uid();
    return v_role = 'admin';
end;
$$;

-- 2. MEMBERS - Elimina TODAS las políticas existentes
drop policy if exists "Staff can manage members" on public.members;
drop policy if exists "Users can view own member profile" on public.members;
drop policy if exists "Members can view own profile" on public.members;
drop policy if exists "Leaders can view ministry members" on public.members;
drop policy if exists "Admins can manage all members" on public.members;

-- Habilita RLS
alter table public.members enable row level security;

-- Políticas nuevas
create policy "Users can view own member profile"
    on public.members for select
    to authenticated
    using (id = auth.uid());

create policy "Admins can manage all members"
    on public.members for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- 3. HOUSEHOLDS - Elimina TODAS las políticas existentes
drop policy if exists "Staff can manage households" on public.households;
drop policy if exists "Authenticated users can view households" on public.households;
drop policy if exists "Admins can manage households" on public.households;

alter table public.households enable row level security;

create policy "Admins can manage households"
    on public.households for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());