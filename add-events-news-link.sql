-- ============================================
-- VINCULAR NOTICIAS CON EVENTOS
-- Ejecutar en Supabase Dashboard > SQL Editor
-- ============================================
--
-- QUE HACE:
--   1. Agrega public.events.news_id -> public.news(id)
--      para que una noticia marcada como evento cree / actualice su evento.
--   2. Permite que cualquier visitante (sin sesion) vea los eventos activos,
--      que es lo que necesita la pagina publica /eventos.
--
-- Es idempotente: se puede volver a ejecutar sin romper nada.
-- ---------------------------------------------------------------

-- 1) Vincular evento <-> noticia
alter table public.events
    add column if not exists news_id uuid references public.news(id) on delete cascade;

comment on column public.events.news_id is
    'Noticia de origen cuando el evento se creo desde la seccion de noticias';

create unique index if not exists idx_events_news_id
    on public.events(news_id)
    where news_id is not null;

-- 2) Lectura publica de los eventos activos
drop policy if exists "Authenticated can view active events" on public.events;
drop policy if exists "Anyone can view active events" on public.events;

create policy "Anyone can view active events"
    on public.events for select
    to anon, authenticated
    using (is_active = true);

-- 3) Solo el administrador crea y edita eventos
drop policy if exists "Staff can manage events" on public.events;
drop policy if exists "Admins can manage events" on public.events;

create policy "Admins can manage events"
    on public.events for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- ============================================
-- VERIFICACION
-- ============================================
-- select policyname, cmd, roles::text, qual, with_check
-- from pg_policies where tablename = 'events';
--
-- select column_name, data_type from information_schema.columns
-- where table_name = 'events' and column_name = 'news_id';
