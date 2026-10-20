-- ============================================
-- FIX: RLS de la tabla NEWS (y SERMONS)
-- Ejecutar en Supabase Dashboard > SQL Editor
-- ============================================
--
-- REGLA DESEADA:
--   * Solo el ADMINISTRADOR (profiles.role = 'admin') puede crear,
--     editar, publicar y eliminar noticias.
--   * Las noticias PUBLICADAS (is_published = true) las puede ver
--     cualquier visitante, sin iniciar sesion.
--   * El administrador ve todas las noticias, publicadas o no.
--
-- PROBLEMA QUE CORRIGE:
--   POST https://<ref>.supabase.co/rest/v1/news -> 403
--   {"code":"42501","message":"new row violates row-level security policy for table \"news\""}
--
--   La politica anterior exigia:
--     exists (select 1 from public.members m
--             where m.id = auth.uid() and m.membership_status in ('Miembro activo'))
--
--   members.id es un uuid propio (NO es el id de auth.users), por lo que
--   auth.uid() nunca coincidia -> WITH CHECK fallaba -> 42501 -> 403.
--   El panel admin en realidad autoriza con profiles.role = 'admin'.
--
-- ---------------------------------------------------------------

-- 1) Funcion helper is_admin() (idempotente, ya existe en tu base)
create or replace function public.is_admin()
returns boolean language plpgsql security definer set search_path = public as $$
declare
    v_role text;
begin
    select role into v_role from public.profiles where id = auth.uid();
    return v_role = 'admin';
end;
$$;

-- ============================================
-- 2) NEWS
-- ============================================
alter table public.news enable row level security;

-- Eliminar las politicas anteriores
drop policy if exists "Anyone can view published news" on public.news;
drop policy if exists "Admins can manage all news" on public.news;
drop policy if exists "Staff can manage news" on public.news;
drop policy if exists "Staff can manage all news" on public.news;

-- 2.1) Lectura publica: cualquiera ve las noticias PUBLICADAS
create policy "Anyone can view published news"
    on public.news for select
    to anon, authenticated
    using (is_published = true);

-- 2.2) Escritura: solo el administrador
--      (for all = select + insert + update + delete;
--       como el admin cumple is_admin(), tambien ve las no publicadas)
create policy "Admins can manage all news"
    on public.news for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- ============================================
-- 3) SERMONS (mismo error que news: predicaciones/nueva)
-- ============================================
alter table public.sermons enable row level security;

drop policy if exists "Anyone can view published sermons" on public.sermons;
drop policy if exists "Admins can manage all sermons" on public.sermons;
drop policy if exists "Staff can manage sermons" on public.sermons;
drop policy if exists "Staff can manage all sermons" on public.sermons;

create policy "Anyone can view published sermons"
    on public.sermons for select
    to anon, authenticated
    using (is_published = true);

create policy "Admins can manage all sermons"
    on public.sermons for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- ============================================
-- 4) VERIFICACION (opcional, ejecuta y revisa el resultado)
-- ============================================
-- select policyname, cmd, roles, qual, with_check from pg_policies where tablename = 'news';
--
-- Debe mostrar 2 filas:
--   "Anyone can view published news" | SELECT | {anon,authenticated} | is_published = true
--   "Admins can manage all news"     | ALL    | {authenticated}      | is_admin() / is_admin()
